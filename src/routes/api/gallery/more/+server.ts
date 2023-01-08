import { error } from '@sveltejs/kit';

import { getCachedList } from '$lib/cache/cacheInstance';
import { sliceElements } from '$lib/utils/array';
import { log } from '$lib/utils/log';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { charactersConfig } from '$lib/config';

import type { ICharacter } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const { filter, sort, expand, batch } = charactersConfig;
  const characters = await getCachedList<ICharacter>('characters', filter, sort, expand);
  if (!characters || !characters.length) throw error(503, 'No characters returned');

  const validCharacters = characters.filter(verifyCharacter);
  if (!validCharacters.length) throw error(503, 'No valid characters found');

  const edgeId = url.searchParams.get('edgeId');
  const right = url.searchParams.get('right') === 'true';

  const edgeIndex = validCharacters.findIndex(({ id }) => id === edgeId);
  if (edgeIndex === -1) throw error(503, 'Edge id is not found');

  const from = right ? edgeIndex + 1 : edgeIndex - batch;
  const to = right ? edgeIndex + batch + 1 : edgeIndex;
  const items = sliceElements(validCharacters, from, to).map(getGalleryItemData);

  log('gallery', `Loading ${batch} more items`);
  return new Response(JSON.stringify(items));
};
