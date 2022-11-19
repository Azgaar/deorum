import { sections } from '$lib/data/sections';
import { t } from '$lib/locales/translations';

import type { ICharacter } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { get } from 'svelte/store';
import { report } from './log';
import { capitalize } from './string';

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

const getTags = (character: ICharacter, tags: Map<string, { name: string }>): string[] => {
  if (!character.tags.length) return [];
  const tagNames = character.tags.map((tag) => tags.get(tag)?.name);
  return tagNames.filter((tagName) => tagName) as string[];
};

const selectSections = (): string[] => {
  return sections.filter((section) => Math.random() < section.chance).map(({ name }) => name);
};

export const createBasicPrompt = (character: ICharacter, tags: Map<string, { name: string }>) => {
  const { name, gender, age, height, weight } = character;
  const { race, archetype, background } = character['@expand'];

  const d = {
    gender,
    race: race ? race.name : '',
    age: age ? `${age} years old` : null,
    height: height ? `height: ${height}` : null,
    weight: weight ? `weight: ${weight}` : null,
    name: name ? `Name: ${name}` : null,
    archetype: archetype ? `Archetype: ${archetype.name}` : null,
    background: background ? `Background: ${background.name}` : null
  };
  const tagList = getTags(character, tags);
  const sectionList = selectSections();

  const intro = 'Biography of a dark fantasy character';
  const specie = `${d.gender} ${d.race}`.trim();
  const part1 = [specie, d.age, d.height, d.weight].filter((v) => v).join(', ');
  const part2 = [d.name, d.archetype, d.background].filter((v) => v).join('. ');
  const tag = tagList.length ? `Tags: ${tagList.join(', ')}` : '';
  const section = sectionList.length ? `Contains sections: ${sectionList.join(', ')}` : '';
  const outro1 = 'High quality text';
  const outro2 = `Detailed biography of ${d.race} in Dark Fantasy style.`;

  const prompt = [intro, part1, part2, tag, section, outro1, outro2]
    .filter((v) => v)
    .map((part) => capitalize(part))
    .join('. ');

  return prompt;
};
