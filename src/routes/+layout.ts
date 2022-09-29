import { locale, loadTranslations } from '$lib/locales/translations';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url }: { url: URL }) => {
  const { pathname } = url;

  const defaultLocale = 'en';
  const navigator = typeof window !== 'undefined' ? window.navigator.language : null;
  const initLocale = navigator || locale.get() || defaultLocale;

  await loadTranslations(initLocale, pathname);
  return {};
};
