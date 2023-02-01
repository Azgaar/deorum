import { loadTranslations } from '$lib/locales/translations';

export const load: import('./$types').LayoutLoad = async ({ url, data }) => {
  await loadTranslations(data.lang, url.pathname);
  return data;
};
