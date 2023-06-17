import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getRandomIndex, sliceElements } from '$lib/utils/array';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { toJson } from '$lib/utils/requests';

export const ssr = true;

const SELECT_BEFORE = 5;
const SELECT_AFTER = 15;

export const load: LayoutServerLoad = async ({ url, params, fetch }) => {
  const searchParams = new URLSearchParams({
    sort: url.searchParams.get('sort') || charactersConfig.sort,
    expand: url.searchParams.get('expand') || charactersConfig.expand
  });
  url.searchParams.getAll('filter').forEach((value) => searchParams.append('filter', value));

  const allCharacters = await toJson<ICharacter[]>(fetch(`/api/characters?${searchParams}`));
  if (!allCharacters?.length) throw error(503, 'No characters returned');

  const validCharacters = allCharacters.filter(verifyCharacter);
  if (!validCharacters.length) throw error(503, 'No valid characters found');

  const currentIndex =
    Boolean(params.slug) && validCharacters.findIndex(({ id }) => id === params.slug);

  if (currentIndex === false || currentIndex === -1) {
    const randomId = validCharacters[getRandomIndex(validCharacters.length)].id;
    throw redirect(307, `/gallery/${randomId}`);
  }

  const current = validCharacters[currentIndex];
  log('characters', `Loading character ${current.name} ${params.slug}`);

  const isFiltered = url.searchParams.get('filter');
  if (isFiltered) {
    // if gallery is explicitly filtered, return all filtered characters
    const items = validCharacters.map(getGalleryItemData);
    return { items, currentId: current.id };
  } else {
    // if gallery is not explicitly filtered, return a portion of characters to save resources
    const before = sliceElements(validCharacters, currentIndex - SELECT_BEFORE, currentIndex);
    const after = sliceElements(validCharacters, currentIndex + 1, currentIndex + SELECT_AFTER + 1);
    const items = [...before, current, ...after].map(getGalleryItemData);
    return { items, currentId: current.id };
  }
};
