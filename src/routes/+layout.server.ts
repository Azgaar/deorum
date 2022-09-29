import { loadTranslations, locale } from '$lib/locales/translations';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, request }: { url: URL; request: Request }) => {
  const { pathname } = url;

  const defaultLocale = 'en';
  const accepts = request?.headers?.get('accept-language');
  const preferred = accepts ? accepts.split(',')[0] : null;
  const initLocale = preferred || locale.get() || defaultLocale;

  await loadTranslations(initLocale, pathname);
  return {};
};
