import { KEYS, charactersConfig } from '$lib/config';
import type { ICharacter, IPortrait } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch, depends }) => {
  const parentData = await parent();
  if (!parentData.userId) throw new Error('User not logged in');

  const [custom, uploaded, liked] = await Promise.all([
    getCustomCharacters(parentData.userId),
    getUploadedPortaits(parentData.userId),
    getLikedCharacters(parentData.liked)
  ]);

  depends(KEYS.LIBRARY);

  log(
    'library',
    `Loading user ${parentData.userId} library. Custom characters: ${custom.length}, uploaded portraits: ${uploaded.length}, liked characters: ${liked.length}`
  );

  return { library: { custom, uploaded, liked } };

  async function getCustomCharacters(userId: string) {
    const url = `/api/custom?filter=(creator="${userId}")&sort=updated&expand=${charactersConfig.expand}`;
    const characters = await toJson<ICharacter[]>(fetch(url));
    const items = characters.map(getGalleryItemData);

    return items;
  }

  async function getUploadedPortaits(userId: string) {
    const url = `/api/portraits?filter=(user="${userId}")&sort=updated`;
    const portraits = await toJson<IPortrait[]>(fetch(url));

    return portraits;
  }

  async function getLikedCharacters(ids: string[]) {
    if (!ids.length) return [];

    const filter = ids.map((id) => `id="${id}"`).join('||');
    const url = `/api/characters?filter=(${filter})&expand=${charactersConfig.expand}`;
    const characters = await toJson<ICharacter[]>(fetch(url));
    const items = characters
      .map(getGalleryItemData)
      .sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));

    return items;
  }
};
