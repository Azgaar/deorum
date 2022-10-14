import { get } from 'svelte/store';

import { t } from '$lib/locales/translations';

export const getEmojiedLabel = (key: string, data?: { emoji: string; name: string }) => {
  const { emoji, name } = data || {};
  return emoji + ' ' + get(t)(`admin.${key}.${name}`);
};
