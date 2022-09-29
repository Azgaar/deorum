import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
  fallbackLocale: 'en',
  loaders: [
    { locale: 'en', key: 'common', loader: async () => (await import('./en/common.json')).default },
    {
      locale: 'en',
      key: 'admin',
      routes: ['/admin'],
      loader: async () => (await import('./en/admin.json')).default
    },
    { locale: 'ru', key: 'common', loader: async () => (await import('./ru/common.json')).default },
    {
      locale: 'ru',
      key: 'admin',
      routes: ['/admin'],
      loader: async () => (await import('./ru/admin.json')).default
    }
  ]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
