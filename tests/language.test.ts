import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as enter } from '../functions/index.ts';
import { onRequest as choose } from '../functions/language.ts';

function request(country?: string, cookie?: string, extra: Record<string, string> = {}) {
  return Object.assign(new Request('https://doubletree.world/', {
    headers: { ...extra, ...(cookie ? { Cookie: cookie } : {}) },
  }), { cf: country ? { country } : undefined });
}

for (const [country, expected] of [['CN', 'zh'], ['US', 'en'], ['HK', 'en'], ['XX', 'en'], [undefined, 'en']] as const) {
  test(`first visit from ${country ?? 'unknown'} selects ${expected}`, () => {
    const result = enter({ request: request(country) });
    assert.equal(result.status, 302);
    assert.equal(result.headers.get('Location'), `/${expected}/`);
    assert.match(result.headers.get('Cache-Control')!, /private, no-store/);
    assert.equal(result.headers.get('Set-Cookie'), null);
  });
}

test('browser language and spoofed country headers cannot override trusted geography', () => {
  assert.equal(enter({ request: request('US', undefined, { 'Accept-Language': 'zh-CN', 'CF-IPCountry': 'CN' }) }).headers.get('Location'), '/en/');
  assert.equal(enter({ request: request(undefined, undefined, { 'CF-IPCountry': 'CN' }) }).headers.get('Location'), '/en/');
});

test('manual choice survives refresh and a new root visit in either country', () => {
  for (const lang of ['en', 'zh']) {
    const response = choose({ request: new Request(`https://doubletree.world/language?lang=${lang}`) });
    assert.equal(response.headers.get('Location'), `/${lang}/`);
    const cookie = response.headers.get('Set-Cookie')!;
    assert.match(cookie, /Max-Age=31536000; SameSite=Lax; HttpOnly; Secure/);
    for (const country of ['CN', 'US', undefined]) {
      for (let visit = 0; visit < 2; visit++) {
        assert.equal(enter({ request: request(country, `other=x; ${cookie.split(';')[0]}`) }).headers.get('Location'), `/${lang}/`);
      }
    }
  }
});

test('invalid cookies fall back safely; malformed input does not crash', () => {
  for (const cookie of ['dt_language=fr', 'dt_language=%ZZ', 'not_dt_language=zh', 'dt_language=']) {
    assert.equal(enter({ request: request('CN', cookie) }).headers.get('Location'), '/zh/');
  }
});

test('language endpoint rejects arbitrary destinations and unsupported languages', () => {
  for (const value of ['', 'fr', 'https://example.com', '../../']) {
    const response = choose({ request: new Request(`https://doubletree.world/language?lang=${encodeURIComponent(value)}`) });
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('Location'), null);
  }
});

test('HTTP localhost can set preference without a Secure cookie', () => {
  const response = choose({ request: new Request('http://localhost:4321/language?lang=zh') });
  assert.doesNotMatch(response.headers.get('Set-Cookie')!, /Secure/);
});
