import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const { userId, liked } = await parent();
  if (!liked.length) return { favorite: [] };

  const filter = liked.map((id) => `id="${id}"`).join('||');

  const res = await fetch(`/api/characters?filter=(${filter})&expand=${charactersConfig.expand}`);
  const favoriteCharacters = await (<Promise<ICharacter[]>>res.json());
  const favorite = favoriteCharacters.map(getGalleryItemData);

  log('favorites', `Loading favorite characters (${favorite.length}) of user ${userId}`);

  return { favorite };
};
