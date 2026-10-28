import type { AstroIntegration } from 'astro';
import { onRequest as enter } from '../functions/index.ts';
import { onRequest as choose } from '../functions/language.ts';

export default function developmentLanguageRouting(): AstroIntegration {
  return {
    name: 'development-language-routing',
    hooks: {
      'astro:server:setup': ({ server }) => {
        // Intercept before Astro removes cookies and queries from static-page requests.
        // This hook runs only in development and is never deployed to Cloudflare.
        server.middlewares.use((incoming, outgoing, next) => {
          const url = new URL(incoming.url ?? '/', 'http://localhost');
          if (url.pathname !== '/' && url.pathname !== '/language') return next();
          const request = Object.assign(new Request(url, {
            headers: { Cookie: incoming.headers.cookie ?? '' },
          }), { cf: { country: url.searchParams.get('country') ?? undefined } });
          const response = url.pathname === '/' ? enter({ request }) : choose({ request });
          outgoing.statusCode = response.status;
          response.headers.forEach((value, name) => outgoing.setHeader(name, value));
          response.text().then((body) => outgoing.end(body)).catch(next);
        });
      },
    },
  };
}
