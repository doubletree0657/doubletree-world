# First deployment

This project targets **Cloudflare Pages Git integration**, not a static-only upload and not a Workers Builds project. Pages discovers the root `functions/` directory separately from Astro's `dist/` output.

## 1. GitHub

After reviewing the local site and explicitly approving external actions:

1. Open your existing `doubletree-world` GitHub repository, or create an empty repository with that name. Choose visibility deliberately; do not initialize it with another README or license.
2. Copy its remote URL. Do not put credentials in the URL.
3. Run these commands locally, replacing `YOUR_USERNAME`:

```sh
git remote add origin https://github.com/YOUR_USERNAME/doubletree-world.git
git push -u origin main
```

If `origin` already exists, inspect it with `git remote -v` before changing anything. If the remote contains commits, reconcile history instead of force-pushing. Authenticate through GitHub's browser or credential manager; never paste passwords or tokens into chat.

## 2. Cloudflare Pages

After approving project creation:

1. In Cloudflare, open **Workers & Pages**, create an application, choose **Pages**, and import an existing Git repository. Dashboard labels may vary; select the Pages Git workflow.
2. Authorize GitHub access only to the intended repository.
3. Select `doubletree-world` and production branch `main`.
4. Use the repository root as root directory, build command `pnpm build`, and output directory `dist`.
5. Set build environment variable `NODE_VERSION` to `24`. The repository pins pnpm through `packageManager`; retain `pnpm-lock.yaml` and use the current Pages build image.
6. Deploy. Confirm both the Astro build and Pages Functions compilation succeed in the deployment logs. No runtime secrets, bindings, or paid services are required.
7. Open the assigned `*.pages.dev` URL. Check the homepage, both translations, language selection, and 404 before binding the production domain.

Do not upload only `dist/` through dashboard drag-and-drop: this omits the Functions required for geolocation and preferences. Do not add a redirect rule that bypasses the root Function. Do not configure a cache rule that caches `/` or `/language` despite `no-store`. Choose fail-closed behavior for Functions when offered, so exhausted Function quota does not silently fall through to static content. Check the account's plan and included limits before deployment; do not enable a paid plan automatically.

## 3. Production domain

After explicitly approving domain binding and any DNS change:

1. Open the Pages project's **Custom domains** and choose **Set up a custom domain**.
2. Enter `doubletree.world`. Since the zone is managed by Cloudflare, follow its proposed DNS association after reviewing existing records and potential conflicts.
3. Do not manually create an unrelated CNAME before associating the domain with the Pages project. Preserve unrelated mail and verification records.
4. Wait for domain activation and TLS certificate issuance. Verify the domain shows Active and a real browser opens `https://doubletree.world` without certificate warnings.

No subdomains are needed in this milestone. Git pushes to `main` will trigger production builds; other branches may produce preview deployments according to Pages settings. A prior successful deployment can be rolled back in the Pages dashboard.

## Production acceptance

- [ ] GitHub shows the intended source and no credentials.
- [ ] Pages deployment reports success, including Functions compilation.
- [ ] HTTPS is valid at `https://doubletree.world`.
- [ ] Fresh CN traffic at `/` redirects to `/zh/`; fresh non-CN traffic redirects to `/en/`.
- [ ] Missing-country behavior has passed handler tests; real geolocation has been checked separately.
- [ ] Selecting EN in a CN session persists on refresh and revisiting `/`, and vice versa.
- [ ] `/en/` and `/zh/` remain accessible directly without loops.
- [ ] Root and preference redirects return `Cache-Control: private, no-store, max-age=0`.
- [ ] An unknown URL returns HTTP 404 with the custom page.
- [ ] A small subsequent Git push triggers an automatic deployment.

Example response checks (run after deployment):

```sh
curl -I https://doubletree.world/
curl -I 'https://doubletree.world/language?lang=en'
curl -I -H 'Cookie: dt_language=en' https://doubletree.world/
curl -I https://doubletree.world/missing-page/
```

Local builds and mocked country tests are not evidence of successful live deployment.

## Official references

- [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
