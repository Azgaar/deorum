import type { Parser } from '@sveltekit-i18n/parser-default';
import type { Config } from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';

// Auto-discover locales: any subdirectory that has a common.json is a supported locale.
const commonModules = import.meta.glob<{ default: Record<string, unknown> }>('./*/common.json');
const termsModules = import.meta.glob<{ default: Record<string, unknown> }>('./*/terms.json');
const adminModules = import.meta.glob<{ default: Record<string, unknown> }>('./*/admin.json');

export const locales = Object.keys(commonModules).map((path) => path.split('/')[1]);

const loaders = locales.flatMap((locale) => [
  {
    locale,
    key: 'common',
    loader: () => commonModules[`./${locale}/common.json`]().then((m) => m.default)
  },
  {
    locale,
    key: 'terms',
    routes: [/terms/],
    loader: () => termsModules[`./${locale}/terms.json`]().then((m) => m.default)
  },
  {
    locale,
    key: 'admin',
    routes: [/admin/, /match/],
    loader: () => adminModules[`./${locale}/admin.json`]().then((m) => m.default)
  }
]);

const config: Config = { fallbackLocale: 'en', loaders };

export const { t, locale, loading, loadTranslations } = new i18n<
  Parser.Params<{ variable?: string | number | null }>
>(config);
