# DoubleTree's World

A quiet, bilingual personal space for music, cosplay, computer science, and everyday discoveries. Production domain: **https://doubletree.world** (not deployed yet).

## Architecture

- Astro + TypeScript generates static HTML and plain CSS into `dist/`. No SSR adapter or browser framework runtime is needed.
- Cloudflare Workers + Static Assets hosts the output. `worker/index.ts` is the Worker entry point, with an `ASSETS` binding configured in `wrangler.toml`.
- `assets.run_worker_first = ["/", "/language"]` reserves only the entry redirect and language preference endpoint for Worker execution. Localized pages and other files are served directly as static assets.
- `not_found_handling = "404-page"` serves Astro's `404.html` with status 404. There is no SPA fallback.
- GitHub + Workers Builds will deploy approved pushes to `main` after the Cloudflare setup described in [the deployment guide](docs/DEPLOYMENT.md).

No database, accounts, tracking, third-party geolocation, or extra cloud service is required. Future APIs can be added to the Worker with corresponding `run_worker_first` patterns when needed.

## Local development

Use Node.js 24.22.1 (pinned in `.node-version`) and pnpm 11.25.0 (pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:4321`. Keep the development process running while browsing. Stop it with Ctrl+C.

```sh
pnpm check
pnpm test
pnpm test:runtime
pnpm build
pnpm preview
```

- `check` generates current Workers runtime/binding types with Wrangler, checks Astro, and separately checks the Worker against the generated types. `worker-configuration.d.ts` is generated and ignored; rerun `pnpm types` after changing Wrangler configuration.
- `test` exercises the actual Worker entry point and shared language routing with country fixtures.
- `test:runtime` builds the site, starts a temporary local Wrangler server, checks real Worker and Static Assets responses, and stops its own server. It does not deploy.
- `build` only generates static files. `preview` runs the current build and Worker with `wrangler dev --local`, normally at `http://localhost:8787`. Rebuild after changing site content.
- `pnpm exec wrangler deploy --dry-run` checks the upload bundle without publishing. `pnpm deploy` / `pnpm exec wrangler deploy` performs a real deployment and requires explicit owner approval.

## Language behavior

1. `/` respects a valid `dt_language` cookie first.
2. Without a preference, trusted `request.cf.country === 'CN'` selects `/zh/`; all other, unknown, or missing country values select `/en/`.
3. `/language?lang=zh` or `en` sets the preference for one year and redirects to the selected page. Cookies use `Path=/`, `HttpOnly`, `SameSite=Lax`, and `Secure` over HTTPS.
4. `/zh/` and `/en/` always remain directly accessible regardless of geography or cookies. Direct page visits do not overwrite preferences.

Redirects use `302` and `Cache-Control: private, no-store, max-age=0`, with `Vary: Cookie`. Geographic redirects and saved preferences are never shared through a public cache. Explicit language pages are deterministic static HTML, with canonical URLs, alternate language links, and correct `lang` attributes. `public/_headers` is supported by Workers Static Assets; it adds security headers to asset responses. Worker responses set their own cache headers.

No browser-language override or client-supplied country header is trusted. Automatic detection does not set a cookie. Browsers that block cookies can still open explicit language URLs but cannot retain a root-path preference.

### Local country simulation

Astro's development-only integration reuses the production language handler:

| Scenario | Action with no preference cookie | Expected |
| --- | --- | --- |
| Mainland China | `http://localhost:4321/?country=CN` | `/zh/` |
| Other country | `http://localhost:4321/?country=US` | `/en/` |
| Missing / unknown country | `/` or `/?country=XX` | `/en/` |
| Manual override | Choose EN, revisit `/?country=CN` | `/en/` |
| Persistence | Refresh or revisit `/` | Saved language |
| Explicit URL | Open `/zh/` with an EN cookie | Chinese page, no loop |

Clear `dt_language` or use a fresh browser profile between first-visit cases. The simulation is **only available in Astro development**, never in the production Worker or Wrangler preview. Wrangler may provide simulated/cached `cf` metadata; missing-country fallback is also covered by deterministic Worker tests. Local tests do not prove live IP geolocation, DNS, TLS, or Workers Builds connectivity.

## Structure

```text
worker/index.ts          Worker entry point and ASSETS fallback
src/lib/language*.ts     Cookie selection, redirects, shared routing
src/i18n/                Complete English and Simplified Chinese content
src/layouts/             HTML document and metadata
src/pages/               Localized homepages, entry fallback, and 404
src/styles/              Responsive editorial styling
scripts/dev-language.ts  Development-only country simulation
public/                  Favicon, asset headers, robots, sitemap
tests/                   Worker unit tests and local runtime integration tests
wrangler.toml            Worker entry, Static Assets binding, selective routing
tsconfig.worker.json     Worker runtime type-check boundary
docs/DEPLOYMENT.md       Workers Builds setup and production acceptance
```

Future themes remain marked as coming soon without broken links. Edit `src/i18n/content.ts` to update both translations. Keep documentation, comments, identifiers, and commit messages in English. Never commit credentials or local environment files. Commit, push, cloud resource creation, domain changes, and real deployment require the owner's approval for this migration.
