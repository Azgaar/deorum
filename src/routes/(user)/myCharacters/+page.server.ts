import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const parentData = await parent();

  const [liked, custom] = await Promise.all([
    getCharacters<ICharacter>('characters', parentData.liked),
    getCharacters<ICharacter>('custom', parentData.custom)
  ]);

  log(
    'myCharacters',
    `Loading ${liked.length} liked and ${custom.length} custom characters of user ${parentData.userId}`
  );

  return { myCharacters: { liked, custom } };

  async function getCharacters<T extends ICharacter>(
    collection: 'characters' | 'custom',
    ids: string[]
  ) {
    if (!ids.length) return [];

    const filter = ids.map((id) => `id="${id}"`).join('||');
    const url = `/api/${collection}?filter=(${filter})&expand=${charactersConfig.expand}`;
    const characters = await toJson<T[]>(fetch(url));
    const items = characters
      .map(getGalleryItemData)
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

    return items;
  }
};
