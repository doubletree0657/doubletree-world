import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
let processHandle;
let base;

before(async () => {
  const reservation = createServer();
  await new Promise((resolve, reject) => {
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', resolve);
  });
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  base = `http://127.0.0.1:${port}`;
  processHandle = spawn(process.execPath, [
    'node_modules/wrangler/bin/wrangler.js', 'dev', '--local', '--ip', '127.0.0.1', '--port', String(port),
  ], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CLOUDFLARE_SEND_METRICS: 'false', WRANGLER_LOG_PATH: `${root}.wrangler/runtime-test.log` },
  });
  await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error(`Wrangler startup timed out:\n${output}`)), 60000);
    const exited = (code) => { clearTimeout(timeout); reject(new Error(`Wrangler exited (${code}):\n${output}`)); };
    processHandle.once('exit', exited);
    processHandle.once('error', (error) => { clearTimeout(timeout); reject(error); });
    const collect = (chunk) => {
      output = (output + chunk.toString()).slice(-12000);
      if (/Ready on http:/.test(output)) {
        clearTimeout(timeout);
        processHandle.off('exit', exited);
        resolve();
      }
    };
    processHandle.stdout.on('data', collect);
    processHandle.stderr.on('data', collect);
  });
});

after(() => {
  if (!processHandle || processHandle.exitCode !== null) return;
  if (process.platform === 'win32') {
    // Stop only the process tree spawned by this test, including workerd.
    execFileSync('taskkill.exe', ['/PID', String(processHandle.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    processHandle.kill('SIGTERM');
  }
});

const get = (path, options = {}) => fetch(base + path, { redirect: 'manual', ...options });

test('built configuration uses selective Worker routing and an HTML 404', async () => {
  const config = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(config, /run_worker_first\s*=\s*\["\/", "\/language"\]/);
  assert.match(config, /not_found_handling\s*=\s*"404-page"/);
  assert.doesNotMatch(config, /pages_build_output_dir|single-page-application/);
  const rootResponse = await get('/');
  assert.equal(rootResponse.status, 302);
  assert.ok(['/en/', '/zh/'].includes(rootResponse.headers.get('Location')));
  assert.match(rootResponse.headers.get('Cache-Control'), /private, no-store/);
});

test('Static Assets serves both languages regardless of saved preference', async () => {
  for (const [path, language, cookie] of [
    ['/en/', 'en', 'dt_language=zh'], ['/zh/', 'zh-CN', 'dt_language=en'],
  ]) {
    const response = await get(path, { headers: { Cookie: cookie } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Location'), null);
    assert.equal(response.headers.get('Set-Cookie'), null);
    const html = await response.text();
    assert.ok(html.includes(`lang="${language}"`));
    assert.ok(html.includes(`rel="canonical" href="https://doubletree.world${path}"`));
    assert.ok(html.includes('hreflang="zh-CN"'));
    assert.ok(html.includes('href="/language?lang=en"'));
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  }
});

test('Worker preference endpoint persists choice through repeated root visits', async () => {
  for (const language of ['zh', 'en']) {
    const choice = await get(`/language?lang=${language}`);
    assert.equal(choice.status, 302);
    assert.equal(choice.headers.get('Location'), `/${language}/`);
    assert.match(choice.headers.get('Cache-Control'), /no-store/);
    const cookie = choice.headers.get('Set-Cookie');
    assert.match(cookie, /Max-Age=31536000; SameSite=Lax; HttpOnly/);
    for (let visit = 0; visit < 2; visit++) {
      const response = await get('/?country=XX', { headers: { Cookie: cookie.split(';')[0] } });
      assert.equal(response.headers.get('Location'), `/${language}/`);
      const page = await get(response.headers.get('Location'));
      assert.equal(page.status, 200);
      assert.equal(page.headers.get('Location'), null);
    }
  }
  const invalid = await get('/language?lang=https://example.com');
  assert.equal(invalid.status, 400);
  assert.equal(invalid.headers.get('Location'), null);
});

test('unknown paths return the custom 404 rather than the homepage', async () => {
  for (const path of ['/missing-page/', '/missing-file.js']) {
    const response = await get(path);
    assert.equal(response.status, 404);
    assert.ok((await response.text()).includes('A path yet'));
  }
});

test('static asset, sitemap, and clean URL behavior are served by the assets configuration', async () => {
  for (const path of ['/favicon.svg', '/robots.txt', '/sitemap.xml']) {
    assert.equal((await get(path)).status, 200);
  }
  const clean = await get('/zh');
  assert.equal(clean.status, 307);
  assert.equal(new URL(clean.headers.get('Location'), base).pathname, '/zh/');
});
