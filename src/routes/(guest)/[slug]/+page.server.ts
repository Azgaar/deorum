import { error } from '@sveltejs/kit';

import { getCachedItem } from '$lib/cache/cacheInstance';

import type { ICharacter } from '$lib/types/api.types';
import { verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';

const EXPAND = 'race,archetype,background,portraits';

export const load: import('./$types').PageServerLoad = async ({ params, fetch }) => {
  const id = params.slug;
  const request = fetch(`/api/characters/${id}?expand=${EXPAND}`);
  const character = await getCachedItem<ICharacter>('character', id, request, EXPAND);
  if (!character || !verifyCharacter(character))
    throw error(503, `Character with this id ${id} is not found`);

  log('character', `Loading character ${id}`);

  return { character };
};
