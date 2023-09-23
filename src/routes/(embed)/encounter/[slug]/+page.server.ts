import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import crypto from 'crypto';
import { createClient } from '@vercel/kv';
import { KV_REST_API_TOKEN, KV_REST_API_URL } from '$env/static/private';

export const csr = false;

const kv = createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });

export const load: PageServerLoad = async ({ params, fetch }) => {
  const seed = `encounter-${params.slug}`;
  const associatedId = await kv.get<string>(seed); // check if seed is associated with id in KV
  const searchParams = new URLSearchParams({ expand: charactersConfig.expand });
  let character: ICharacter;

  if (associatedId) {
    character = await toJson<ICharacter>(fetch(`/api/characters/${associatedId}?${searchParams}`));
    if (!character) throw error(500, `No character with id ${associatedId} returned`);
  } else {
    const allCharacters = await toJson<ICharacter[]>(fetch(`/api/characters?${searchParams}`));
    if (!allCharacters?.length) throw error(500, 'No characters returned');
    const index = mapSeedToIndex(seed, allCharacters.length);
    character = allCharacters[index];

    kv.set(seed, character.id); // associate seed with character id and store in KV
  }

  const item = getGalleryItemData(character);
  log('encounter', `Loading ${associatedId ? 'associated' : 'random'} character ${item.name}`, {
    id: character.id,
    seed
  });
  return { item };
};

function mapSeedToIndex(seed: string, size: number) {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  const hashInteger = parseInt(hash, 16);
  return hashInteger % size;
}
