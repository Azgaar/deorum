import { loadTranslations } from '$lib/locales/translations';
import * as stores from '$lib/stores';

export const load: import('./$types').LayoutLoad = async ({ url, data }) => {
  const { user, lang } = data;

  if (user) {
    stores.user.set(user.email);
    stores.role.set(user.profile.role);
  }

  await loadTranslations(lang, url.pathname);
  return {};
};
