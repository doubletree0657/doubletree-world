import { isLanguage, languageRedirect, preferenceCookie, preferredLanguage } from './language.ts';

// A structural request interface allows the same handler in Workers and Astro's dev server.
export interface LanguageRequest {
  url: string;
  headers: { get(name: string): string | null };
  cf?: { country?: string };
}

export function handleLanguageRequest(request: LanguageRequest): Response | undefined {
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return languageRedirect(preferredLanguage(request.headers.get('Cookie'), request.cf?.country));
  }
  if (url.pathname !== '/language') return undefined;

  const language = url.searchParams.get('lang');
  if (!isLanguage(language)) {
    return new Response('Unsupported language.', { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  return languageRedirect(language,
    `${preferenceCookie}=${language}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secure}`);
}
