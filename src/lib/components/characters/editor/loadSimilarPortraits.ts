import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { request } from '$lib/utils/requests';
import type { ICharacter, IPortrait } from '$lib/types/api.types';
import type { TSimilarityCriteria } from '$lib/types/portraits.types';

export async function loadSimilarPortraits(character: ICharacter) {
  const similarPortraits = await fetchSimilar(character);

  const currentPortraits = character['@expand'].portraits || [];
  const currentPortraitIds = currentPortraits.map(({ id }) => id);
  const newPortraits = similarPortraits.filter(({ id }) => !currentPortraitIds.includes(id));
  const mergedPortraits = [...currentPortraits, ...newPortraits];
  return mergedPortraits;
}

async function fetchSimilar(character: ICharacter) {
  try {
    const data: TSimilarityCriteria = {
      original: character['@expand']?.portraits?.[0].original,
      gender: character.gender,
      race: character.race,
      archetype: character.archetype,
      background: character.background
    };
    const similarPortraits = await request<IPortrait[]>('/api/portraits/similar', 'POST', data);
    return similarPortraits;
  } catch (error) {
    report('character editor', error);
    toastError(error as string);
    return [];
  }
}
