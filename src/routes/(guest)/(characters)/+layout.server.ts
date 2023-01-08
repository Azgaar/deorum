import { error, redirect } from '@sveltejs/kit';

import { getRandomIndex, sliceElements } from '$lib/utils/array';
import { getCachedList } from '$lib/cache/cacheInstance';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { charactersConfig } from '$lib/config';

import type { ICharacter } from '$lib/types/api.types';

const SELECT_BEFORE = 10;
const SELECT_AFTER = 15;

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const { filter, sort, expand } = charactersConfig;
  const characters = await getCachedList<ICharacter>('characters', filter, sort, expand);
  if (!characters || !characters.length) throw error(503, 'No characters returned');

  const validCharacters = characters.filter(verifyCharacter);
  if (!validCharacters.length) throw error(503, 'No valid characters found');

  const currentIndex =
    Boolean(params.slug) && validCharacters.findIndex(({ id }) => id === params.slug);
  if (currentIndex === false || currentIndex === -1) {
    const randomId = validCharacters[getRandomIndex(validCharacters.length)].id;
    throw redirect(307, `/gallery/${randomId}`);
  }

  const current = validCharacters[currentIndex];
  const before = sliceElements(validCharacters, currentIndex - SELECT_BEFORE, currentIndex);
  const after = sliceElements(validCharacters, currentIndex + 1, currentIndex + SELECT_AFTER + 1);
  const items = [...before, current, ...after].map(getGalleryItemData);

  log('characters', `Loading character ${current.name} ${params.slug}`);

  return { items, currentId: current.id };
};
