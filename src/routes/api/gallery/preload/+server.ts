import { error, json } from '@sveltejs/kit';

import { getRandomIndex, sliceElements } from '$lib/utils/array';
import { log } from '$lib/utils/log';
import { getGalleryItemData, verifyCharacter } from '$lib/utils/characters';
import { charactersConfig } from '$lib/config';

import type { ICharacter } from '$lib/types/api.types';
import type { RequestHandler } from '../more/$types';

const TAIL_IMAGES = 2;

export const GET: RequestHandler = async ({ fetch }) => {
  const { filter, sort, expand } = charactersConfig;
  const res = await fetch(`/api/characters?sort=${sort}&filter=${filter}&expand=${expand}`);
  const allCharacters = await (<Promise<ICharacter[]>>res.json());
  if (!allCharacters || !allCharacters.length) throw error(503, 'No characters returned');

  const validCharacters = allCharacters.filter(verifyCharacter);
  if (!validCharacters.length) throw error(503, 'No valid characters found');

  const currentIndex = getRandomIndex(validCharacters.length);

  const current = validCharacters[currentIndex];
  const before = sliceElements(validCharacters, currentIndex - TAIL_IMAGES, currentIndex);
  const after = sliceElements(validCharacters, currentIndex + 1, currentIndex + TAIL_IMAGES + 1);
  const items = [...before, current, ...after].map(getGalleryItemData);

  log('characters', `Preloading gallery for ${current.name} ${current.id}`);

  return json(items);
};
