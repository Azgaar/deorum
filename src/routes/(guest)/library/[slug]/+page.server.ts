import { KEYS, charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { log } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params, fetch, depends }) => {
  const parentData = await parent();

  const id = params.slug;
  const filter = `creator="${parentData.userId}"`;
  const expand = charactersConfig.expand;
  const url = `/api/custom/${id}?filter=${filter}&expand=${expand}`;

  const character = await toJson<ICharacter>(fetch(url));
  const item = getGalleryItemData(character);

  depends(KEYS.CUSTOM_CHARACTER);

  log('library', `Loading custom character ${item.id} of user ${parentData.userId}`);
  return { item };
};
