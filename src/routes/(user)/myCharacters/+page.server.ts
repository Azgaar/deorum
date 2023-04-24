import { KEYS, charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch, depends }) => {
  const parentData = await parent();

  const [liked, custom] = await Promise.all([
    getLikedCharacters(parentData.liked),
    getCustomCharacters(parentData.userId)
  ]);

  depends(KEYS.MY_CHARACTERS);

  log(
    'myCharacters',
    `Loading ${liked.length} liked and ${custom.length} custom characters of user ${parentData.userId}`
  );

  return { myCharacters: { liked, custom } };

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

  async function getCustomCharacters(userId: string | null) {
    if (!userId) return [];

    const url = `/api/custom?filter=(creator="${userId}")&sort=updated&expand=${charactersConfig.expand}`;
    const characters = await toJson<ICharacter[]>(fetch(url));
    const items = characters.map(getGalleryItemData);

    return items;
  }
};
