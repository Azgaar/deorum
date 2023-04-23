import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { request } from '$lib/utils/requests';
import type { ICharacter, IPortrait } from '$lib/types/api.types';
import type { TSimilarityCriteria } from '$lib/types/portraits.types';

export async function fetchSimilar(character: ICharacter) {
  try {
    const isEdit = Boolean(character.id);
    const data: TSimilarityCriteria = {
      original: isEdit ? character['@expand']?.portraits?.[0].original : undefined,
      gender: character.gender || undefined,
      race: character.race || undefined,
      archetype: character.archetype || undefined,
      background: character.background || undefined
    };
    const similarPortraits = await request<IPortrait[]>('/api/portraits/similar', 'POST', data);
    return similarPortraits;
  } catch (error) {
    report('character editor', error);
    toastError(error as string);
    return [];
  }
}
