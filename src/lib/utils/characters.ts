import { t } from '$lib/locales/translations';

import type { ICharacter } from '$lib/types/api.types';
import { get } from 'svelte/store';

export const deriveCharacterLabel = (character: ICharacter): string => {
  const $t = get(t);
  const { name, gender, age } = character;
  const { race, archetype, background } = character['@expand'];

  const elements = {
    name: name || $t('common.character.unnamed'),
    gender: gender ? $t(`common.genders.${gender}`) : null,
    race: race?.name ? $t(`common.races.${race.name}`) : null,
    archetype: archetype ? $t(`common.archetypes.${archetype.name}`) : null,
    background: background ? $t(`common.backgrounds.${background.name}`) : null,
    age: age || null
  };

  return Object.values(elements)
    .filter((value) => value)
    .join(', ');
};
