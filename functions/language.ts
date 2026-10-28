import { isLanguage, languageRedirect, preferenceCookie } from '../src/lib/language.ts';

export function onRequest({ request }: { request: Request }): Response {
  const url = new URL(request.url);
  const language = url.searchParams.get('lang');
  if (!isLanguage(language)) {
    return new Response('Unsupported language.', { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return languageRedirect(language,
    `${preferenceCookie}=${language}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secure}`);
}
