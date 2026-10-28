# DoubleTree's World

A quiet, bilingual personal space for music, cosplay, computer science, and everyday discoveries. Production domain: **https://doubletree.world** (deployment must be completed separately).

## Stack

- Astro and TypeScript, statically generated HTML and plain CSS.
- Cloudflare Pages with two small Pages Functions for language routing.
- No framework runtime in the browser, database, analytics, or third-party geolocation service.

## Development

Install Node.js 22.23.4+ (Node 24 LTS recommended) and pnpm. Then:

```sh
pnpm install
pnpm dev
```

Open `http://127.0.0.1:4321`. Explicit pages are `/en/` and `/zh/`.

```sh
pnpm check
pnpm test
pnpm build
pnpm preview
```

`preview` runs the built site and Pages Functions in Wrangler's local runtime. It does not deploy. `astro preview` alone does not execute Pages Functions.

## Language behavior

1. `/` reads the `dt_language` preference cookie first.
2. Without a valid preference, Cloudflare's trusted `request.cf.country === 'CN'` selects `/zh/`. Every other or missing country selects `/en/`.
3. `/language?lang=zh` or `en` records an explicit preference for one year and redirects to a fixed language URL. Cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` over HTTPS.
4. Explicit language URLs always remain accessible regardless of country or cookie. Merely visiting an explicit URL does not change a saved preference.

Both Function responses are uncacheable. `_routes.json` invokes Functions only for `/` and `/language`; language pages are deterministic static assets. No browser-language override or request-header-based geolocation is used. Automatic detection does not set a preference cookie. A browser that blocks cookies can still navigate explicit language URLs, but cannot retain a manual preference at `/`.

### Local verification

An Astro development-server integration reuses the production handlers and allows **development-only** country simulation:

| Test | URL / action | Expected |
| --- | --- | --- |
| China, fresh browser | `/?country=CN` | `/zh/` |
| Other country | `/?country=US` | `/en/` |
| Missing country | `/` | `/en/` |
| Manual override | Select EN, then visit `/?country=CN` | `/en/` |
| Persistence | Refresh, close/reopen tab, return to `/` | Selected language |
| Direct link | Visit `/zh/` with English preference | Chinese page, no redirect loop |
| Unknown page | `/missing-page/` | 404 page |

Clear `dt_language` between first-visit cases or use a fresh browser profile. Simulation query parameters are ignored in production. Automated tests invoke the actual Function handlers with trusted context fixtures; they do not prove Cloudflare's live geolocation. After deployment, verify a fresh root visit from real CN and non-CN networks, preference persistence, and HTTPS.

## Structure

```text
functions/          Cloudflare root and preference endpoints
src/i18n/           Complete English and Simplified Chinese content
src/layouts/        HTML document and metadata
src/pages/          Localized homepages and 404
src/styles/         Responsive editorial styling
scripts/            Development-only country simulation
public/             Favicon, routing, headers, robots, sitemap
tests/              Language routing and persistence tests
docs/DEPLOYMENT.md  First deployment and production verification
```

Future themes are visibly marked as coming soon, without broken links. No subdomains are provisioned. Edit `src/i18n/content.ts` to update both translations. Keep documentation, comments, identifiers, and commit messages in English.

## Deployment

See [the deployment guide](docs/DEPLOYMENT.md). External repository creation, pushes, Cloudflare project creation, DNS changes, and domain binding require the owner's confirmation. Never commit credentials or local environment files.
