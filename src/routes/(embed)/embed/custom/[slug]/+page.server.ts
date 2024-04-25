import { charactersConfig } from '$lib/config';
import type { ICharacter } from '$lib/types/api.types';
import { getGalleryItemData } from '$lib/utils/characters';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from '../../../encounter/[slug]/$types';

export const csr = false;

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = params.slug;
  const expand = charactersConfig.expand;

  const character = await toJson<ICharacter>(fetch(`/api/custom/${id}?expand=${expand}`));
  const item = getGalleryItemData(character);

  return { item };
};
