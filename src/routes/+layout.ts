import { loadTranslations } from '$lib/locales/translations';
import { likes } from '$lib/stores';

export const load: import('./$types').LayoutLoad = async ({ url, data }) => {
  await loadTranslations(data.lang, url.pathname);

  const likesObj = Object.fromEntries(data.liked.map((id) => [id, true]));
  likes.set(likesObj);

  return data;
};
