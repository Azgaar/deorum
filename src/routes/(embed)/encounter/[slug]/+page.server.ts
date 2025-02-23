import Cache from '$lib/cache/cache.js';
import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import { error } from '@sveltejs/kit';
import crypto from 'crypto';
import type { PageServerLoad } from './$types';

export const csr = false;

const encountersCache = new Cache({ debug: false });

export const load: PageServerLoad = async ({ params, fetch }) => {
  const key = `encounter-${params.slug}`;
  const associatedId = encountersCache.get(key);
  const searchParams = new URLSearchParams({ expand: charactersConfig.expand });
  let character: ICharacter;

  if (associatedId) {
    character = await toJson<ICharacter>(fetch(`/api/characters/${associatedId}?${searchParams}`));
    if (!character) throw error(500, `No character with id ${associatedId} returned`);
  } else {
    const allCharacters = await toJson<ICharacter[]>(fetch(`/api/characters?${searchParams}`));
    if (!allCharacters?.length) throw error(500, 'No characters returned');
    const index = mapSeedToIndex(key, allCharacters.length);
    character = allCharacters[index];

    encountersCache.put(key, character.id); // associate key with character id
  }

  const item = getGalleryItemData(character);
  log('encounter', `Loading ${associatedId ? 'associated' : 'random'} character ${item.name}`, {
    id: character.id,
    seed: params.slug
  });
  return { item };
};

function mapSeedToIndex(seed: string, size: number) {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  const hashInteger = parseInt(hash, 16);
  return hashInteger % size;
}
