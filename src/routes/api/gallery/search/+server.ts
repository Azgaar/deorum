import { charactersConfig } from '$lib/config';
import type { ICharacter, IList } from '$lib/types/api.types';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toJson } from '$lib/utils/requests';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const params = new URLSearchParams({
    page: url.searchParams.get('page') || '1',
    pageSize: url.searchParams.get('pageSize') || '5',
    sort: url.searchParams.get('sort') || '',
    expand: charactersConfig.expand
  });
  url.searchParams.getAll('filter').forEach((value) => params.append('filter', value));

  const list = await toJson<IList<ICharacter>>(fetch(`/api/characters?${params}`));
  const items = list.items.filter(verifyCharacter).map(getGalleryItemData);

  log('search', `Found ${list.totalItems} characters`, url);
  return json({ ...list, items });
};
