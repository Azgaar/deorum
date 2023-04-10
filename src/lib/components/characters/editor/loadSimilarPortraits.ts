import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { request } from '$lib/utils/requests';
import type { ICharacter, IListResult, IPortrait } from '$lib/types/api.types';

export async function loadSimilarPortraits(character: ICharacter) {
  const currentPortraits = character['@expand'].portraits || [];
  const currentPortraitIds = currentPortraits.map(({ id }) => id);
  const similarPortraits = await fetchSimilar(character);
  const newPortraits = similarPortraits.filter(({ id }) => !currentPortraitIds.includes(id));
  const mergedPortraits = [...currentPortraits, ...newPortraits];
  return mergedPortraits;
}

async function fetchSimilar(character: ICharacter) {
  try {
    const mainPortrait = character['@expand']?.portraits?.[0];
    if (!mainPortrait) return [];

    const filter = `original="${mainPortrait.original}"`;
    const portraitsList = await request<IListResult<IPortrait>>(
      `/api/portraits?page=1&pageSize=100&filter=${filter}&sort=-quality`
    );

    return portraitsList.items;
  } catch (error) {
    report('character editor', error);
    toastError(error as string);
    return [];
  }
}
