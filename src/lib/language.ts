export type Language = 'zh' | 'en';
export const preferenceCookie = 'dt_language';

export function isLanguage(value: unknown): value is Language {
  return value === 'zh' || value === 'en';
}

export function preferredLanguage(cookie: string | null, country?: string): Language {
  const value = cookie?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${preferenceCookie}=`))?.slice(preferenceCookie.length + 1);
  return isLanguage(value) ? value : country === 'CN' ? 'zh' : 'en';
}

export function languageRedirect(language: Language, cookie?: string): Response {
  const headers = new Headers({
    Location: `/${language}/`,
    'Cache-Control': 'private, no-store, max-age=0',
    Vary: 'Cookie',
  });
  if (cookie) headers.set('Set-Cookie', cookie);
  return new Response(null, { status: 302, headers });
}
