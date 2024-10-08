import { KEYS, charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, depends }) => {
  const id = params.slug;
  const expand = charactersConfig.expand;
  const url = `/api/custom/${id}?expand=${expand}`;

  const character = await toJson<ICharacter>(fetch(url));
  const item = getGalleryItemData(character);

  depends(KEYS.CUSTOM_CHARACTER);
  return { item };
};
