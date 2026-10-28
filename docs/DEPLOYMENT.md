# Deploy with Cloudflare Workers Builds

This project uses **Workers + Static Assets** and Astro SSG. It has no SSR adapter, platform-specific Functions directory, or SPA fallback. `wrangler.toml` is the deployment source of truth. The Worker handles `/` and `/language`; localized HTML and other assets are served directly from `dist/`.

## 1. Review and publish the migration source

The repository is already associated with `https://github.com/doubletree0657/doubletree-world.git`. After the owner approves committing and pushing this migration:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm test:runtime
pnpm build
pnpm exec wrangler deploy --dry-run
```

Review `git diff`, commit the migration, and push `main`. Do not connect an automatic production build until the migration is present in the intended GitHub commit. The previous repository version uses a different hosting architecture.

## 2. Connect GitHub to Workers Builds

After owner approval for creating a Worker and deploying:

1. Sign in to the Cloudflare account that owns the active `doubletree.world` zone.
2. Open **Workers & Pages > Create application > GitHub**. Authorize access to the `doubletree-world` repository and select `doubletree0657/doubletree-world`.
3. Configure the Worker with the values below. Keep its name equal to `name` in `wrangler.toml`; changing the name can target a different Worker.
4. Review the settings, then select **Save and Deploy**. This action creates/deploys a real Worker; it is not a local preview.
5. In the Worker, review **Settings > Build** and the build logs. Confirm the production branch is `main`, the intended commit was built, and both build and deploy steps succeeded.
6. Open the assigned `https://doubletree-world.<your-subdomain>.workers.dev` URL and run acceptance checks before adding the production domain. If prompted to set up a Workers subdomain, choose it in your own account.

For a Worker that was already created manually, use its **Settings > Build** Git repository connection instead of creating a duplicate Worker. Dashboard labels can change; choose the Workers GitHub workflow.

| Setting | Value |
| --- | --- |
| Worker name | `doubletree-world` |
| Repository | `doubletree0657/doubletree-world` |
| Production branch | `main` |
| Root directory | Repository root (`/`), not `dist` |
| Build command | `pnpm build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Node.js | `24.22.1`, also pinned in `.node-version` |
| pnpm | `11.25.0`, pinned by `packageManager` in `package.json` |
| Static output | `dist`, configured as `assets.directory` in Wrangler |

Workers Builds installs dependencies before the build command. Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` in Git. There is no separate output-directory field needed for hosting; Wrangler uploads the Worker script and assets together. Do not set the deploy command to an assets-only upload.

### Build environment and credentials

Under **Settings > Build > Build Variables and Secrets**, set `NODE_VERSION=24.22.1` to make the runtime choice explicit. The checked-in `.node-version` provides the same version. `PNPM_VERSION=11.25.0` is optional because the checked-in `packageManager` already pins it. `ASTRO_TELEMETRY_DISABLED=1` is optional for build-tool telemetry.

No application runtime variables or secrets are required. The `ASSETS` binding is declared by Wrangler and needs no manual resource creation. Workers Builds manages deployment authentication through its account-side configuration; use the dashboard's managed deployment token flow if prompted. Never commit or paste a deployment token into source or chat. Local CLI deployment, if later authorized, uses `pnpm exec wrangler login` and `pnpm deploy`.

Production pushes to `main` trigger automatic build/deploy after this connection is active. Review non-production branch build settings separately; disable them for the first milestone if previews are not needed. No paid plan, database, or storage service is required by this code; review account limits before choosing any plan.

## 3. Bind doubletree.world

Only after separately approving the production hostname and any resulting DNS change:

1. Open **Workers & Pages > doubletree-world > Settings > Domains & Routes > Add > Custom Domain**.
2. Enter `doubletree.world`, review the proposed changes, then select **Add Custom Domain**.
3. Cloudflare creates the associated DNS record and provisions the certificate. Check existing apex records first; an existing CNAME on the same hostname can block creation. Resolve any conflict deliberately and preserve unrelated mail and verification records.
4. Wait for activation and verify `https://doubletree.world` opens without TLS warnings.

Use a **Custom Domain**, not a wildcard route to an unrelated origin. No subdomains are required. This repository intentionally does not declare production `routes` in Wrangler, so a CLI deploy will not automatically bind or change the formal hostname. Keep the dashboard association under review after deployments. If domain configuration is later moved into Git, add it only after explicit approval.

## 4. Verify the deployed site

Run these checks first against the assigned `workers.dev` origin, then the production hostname. Use a fresh browser profile when testing automatic selection.

| Request / action | Expected |
| --- | --- |
| Fresh `/`, trusted country `CN` | `302` to `/zh/` |
| Fresh `/`, other / unknown / missing country | `302` to `/en/` |
| `/` with `Cookie: dt_language=en` | `302` to `/en/` regardless of country |
| `/zh/` or `/en/` | `200`, correct content and document language, no preference redirect |
| `/language?lang=zh` or `en` | `302`, preference cookie, fixed localized destination |
| Invalid language | `400`, no arbitrary redirect |
| Refresh / reopen tab / revisit `/` | Manual preference is retained |
| `/missing-page/` | `404`, custom bilingual error page |
| `/favicon.svg`, `/robots.txt`, `/sitemap.xml` | `200` static assets |

The root and preference redirects must include `Cache-Control: private, no-store, max-age=0`. Do not add account cache rules that override this behavior. Explicit pages may be cached because their contents do not vary by visitor. Verify canonical/hreflang links remain on the production origin, even while testing the `workers.dev` hostname.

```sh
curl -I https://doubletree.world/
curl -I https://doubletree.world/zh/
curl -I https://doubletree.world/en/
curl -I 'https://doubletree.world/language?lang=en'
curl -I -H 'Cookie: dt_language=en' https://doubletree.world/
curl -I https://doubletree.world/missing-page/
```

Do not use a forged `CF-IPCountry` header or a `?country=CN` query to validate production geography: the Worker deliberately ignores them. Unit tests cover trusted `request.cf` fixtures, including missing and unknown country. Check real CN/non-CN behavior from appropriate networks after deployment, along with valid HTTPS and a subsequent approved push triggering Workers Builds.

## Local validation and release boundary

`pnpm test:runtime` builds the real assets and starts an isolated local Wrangler process. It verifies Worker interception at `/` and `/language`, explicit language pages, preference round trips, asset headers, clean URLs, and real HTTP 404 behavior. It stops its own server afterward. `pnpm preview` is the persistent manual preview; keep it running while inspecting the site.

`pnpm exec wrangler deploy --dry-run` validates packaging without uploading or publishing. A successful local build, test, or dry run is not evidence of a live deployment. GitHub automatic builds, domain routing, live geolocation, and TLS remain unverified until the owner completes the external setup. If a future API is added, extend `assets.run_worker_first` for its route and test it; unmatched static requests should continue to avoid Worker execution.

## Official references

- [Workers Builds setup](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Build image and version settings](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [Static Assets Worker routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
