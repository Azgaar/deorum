import { charactersConfig } from '$lib/config';
import type { ICharacter, IList } from '$lib/types/api.types';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toJson } from '$lib/utils/requests';

export const GET: RequestHandler = async ({ url: { searchParams }, fetch }) => {
  const page = Number(searchParams.get('page'));
  const pageSize = Number(searchParams.get('pageSize'));
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || '';
  const { expand } = charactersConfig;

  const url = `/api/characters?page=${page}&pageSize=${pageSize}&sort=${sort}&filter=${filter}&expand=${expand}`;
  const list = await toJson<IList<ICharacter>>(fetch(url));
  const items = list.items.filter(verifyCharacter).map(getGalleryItemData);

  log('search', `Found ${items.length} characters`, url);
  return json({ ...list, items });
};
