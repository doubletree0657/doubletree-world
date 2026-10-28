import { languageRedirect, preferredLanguage } from '../src/lib/language.ts';

type GeoRequest = Request & { cf?: { country?: string } };

export function onRequest({ request }: { request: GeoRequest }): Response {
  return languageRedirect(preferredLanguage(request.headers.get('Cookie'), request.cf?.country));
}
