import { error, redirect } from '@sveltejs/kit';

import { getRandomIndex, sliceElements } from '$lib/utils/array';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { ICharacter } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';

export const filter = '(inactive=false)';
export const sort = 'id';
export const expand = 'race,archetype,background,portraits';

const SELECT_BEFORE = 10;
const SELECT_AFTER = 15;

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
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

  const selection = [...before, current, ...after];
  const items: IGalleryItem[] = selection.map((character) => {
    const { id, name, gender, age, height, weight } = character;
    const portraits = character['@expand'].portraits || [];
    const mainPortrait = portraits[0];

    const image = `${mainPortrait.id}/${mainPortrait.image}`;
    const race = character['@expand'].race?.name || '';
    const archetype = character['@expand'].archetype?.name || '';
    const background = character['@expand'].background?.name || '';

    return { id, image, name, race, gender, archetype, background, age, weight, height };
  });

  log('gallery', `Loading character ${params.slug}, ${currentIndex}/${characters.length}`);

  return { items, currentId: current.id };
};
