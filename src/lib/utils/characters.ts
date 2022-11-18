import { sections } from '$lib/data/sections';
import { t } from '$lib/locales/translations';

import type { ICharacter } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { get } from 'svelte/store';
import { report } from './log';

export const deriveCharacterLabel = (character: ICharacter): string => {
  const $t = get(t);
  const { name, gender, age } = character;
  const { race, archetype, background } = character['@expand'];

  const elements = {
    name: name || $t('common.character.unnamed'),
    race: race?.name ? $t(`common.races.${race.name}`) : null,
    gender: gender ? $t(`common.genders.${gender}`) : null,
    archetype: archetype ? $t(`common.archetypes.${archetype.name}`) : null,
    background: background ? $t(`common.backgrounds.${background.name}`) : null,
    age: age || null
  };

  return Object.values(elements)
    .filter((value) => value)
    .join(', ');
};

const file = (issue: string, character: ICharacter) => {
  report('characters', issue, character);
  return false;
};

export const verifyCharacter = (char: ICharacter) => {
  const portraits = char['@expand'].portraits;
  if (!portraits?.length) return file(`No portraits for character ${char.id}`, char);
  if (!char['@expand'].race) return file(`No race data for character ${char.id}`, char);
  if (!char['@expand'].archetype) return file(`No archetype data for character ${char.id}`, char);
  if (!char['@expand'].background) return file(`No background data for character ${char.id}`, char);

  const { name, gender, age } = char;
  if (!name) return file(`No name for character ${char.id}`, char);
  if (!gender) return file(`No gender for character ${char.id}`, char);
  if (!age) return file(`No age for character ${char.id}`, char);

  return true;
};

export const getGalleryItemData = (character: ICharacter): IGalleryItem => {
  const { id, name, gender, age, height, weight } = character;
  const portraits = character['@expand'].portraits || [];
  const mainPortrait = portraits[0];

  const image = `${mainPortrait.id}/${mainPortrait.image}`;
  const race = character['@expand'].race?.name || '';
  const archetype = character['@expand'].archetype?.name || '';
  const background = character['@expand'].background?.name || '';

  return { id, image, name, race, gender, archetype, background, age, weight, height };
};

export const getTags = (character: ICharacter) => {
  const mainPortrait = character['@expand'].portraits?.[0];
  if (!mainPortrait) return '';

  // const tags = character['@expand'];
  return '';
};

export const selectSections = () => {
  return sections
    .filter((section) => Math.random() < section.chance)
    .map(({ name }) => name)
    .join(', ');
};
