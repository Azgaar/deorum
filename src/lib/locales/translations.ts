import type { Parser } from '@sveltekit-i18n/parser-default';
import type { Config } from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';

export const locales = ['en', 'ru'];

const loaders = locales
  .flatMap((locale) => {
    return [
      {
        locale,
        key: 'common',
        loader: async () => (await import(`./${locale}/common.json`)).default
      },
      {
        locale,
        key: 'terms',
        routes: [/terms/],
        loader: async () => (await import(`./${locale}/terms.json`)).default
      },
      {
        locale,
        key: 'admin',
        routes: [/admin/, /match/],
        loader: async () => (await import(`./${locale}/admin.json`)).default
      }
    ];
  });

const config: Config = { fallbackLocale: 'en', loaders };

export const { t, locale, loading, loadTranslations } = new i18n<
  Parser.Params<{ variable?: string | number | null }>
>(config);
