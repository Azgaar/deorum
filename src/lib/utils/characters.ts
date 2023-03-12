import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import { sections } from '$lib/data/sections';
import { t } from '$lib/locales/translations';
import type { ICharacter } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { report } from './log';
import { capitalize } from './string';

export const deriveCharacterLabel = (character: ICharacter): string => {
  const { name, gender, age } = character;
  const { race, archetype, background } = character['@expand'];

  const elements = {
    name: name || t.get('common.character.unnamed'),
    race: race?.name ? t.get(`common.races.${race.name}`) : null,
    gender: gender ? t.get(`common.genders.${gender}`) : null,
    archetype: archetype ? t.get(`common.archetypes.${archetype.name}`) : null,
    background: background ? t.get(`common.backgrounds.${background.name}`) : null,
    age: age || null
  };

  return Object.values(elements)
    .filter((value) => value)
    .join(', ');
};

const file = (issue: string) => {
  report('characters', issue);
  return false;
};

export const verifyCharacter = (char: ICharacter) => {
  const portraits = char['@expand']?.portraits;
  if (!portraits?.length) return file(`No portraits for character ${char.id}`);
  if (!char['@expand'].race) return file(`No race data for character ${char.id}`);
  if (!char['@expand'].archetype) return file(`No archetype data for character ${char.id}`);
  if (!char['@expand'].background) return file(`No background data for character ${char.id}`);

  const { name, gender, age } = char;
  if (!name) return file(`No name for character ${char.id}`);
  if (!gender) return file(`No gender for character ${char.id}`);
  if (!age) return file(`No age for character ${char.id}`);

  return true;
};

export const getCharacterImage = (character: ICharacter) => {
  const { '@expand': expand } = character;
  const portraits = expand.portraits || [];
  const mainPortrait = portraits[0];
  return `${mainPortrait.id}/${mainPortrait.image}`;
};

// IGalleryItem is a minimal representation of a ICharacter
// used to reduce data amount sent from server to the client
export const getGalleryItemData = (character: ICharacter): IGalleryItem => {
  const { id, name, gender, age, height, weight, bio, '@expand': expand, likes } = character;
  const image = getCharacterImage(character);

  const race = expand.race?.name || '';
  const archetype = expand.archetype?.name || '';
  const background = expand.background?.name || '';

  return { id, image, name, race, gender, archetype, background, age, weight, height, bio, likes };
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
  const { name, gender, age } = character;
  const { race, archetype, background } = character['@expand'];

  const d = {
    gender,
    race: race ? race.name : '',
    age: age ? `${age} years old` : null,
    name: name ? `Name: ${name}` : null,
    archetype: archetype ? `Nature (behaviour pattern): ${archetype.name}` : null,
    background: background ? `Background (origin): ${background.name}` : null
  };
  const tagList = getTags(character, tags);
  const sectionList = selectSections();

  const intro = 'Literatural biography of a fantasy character';
  const specie = `${d.gender} ${d.race}`.trim();
  const part1 = [specie, d.age].filter((v) => v).join(', ');
  const part2 = [d.name, d.archetype, d.background].filter((v) => v).join('. ');
  const tag = tagList.length ? `Tags: ${tagList.join(', ')}` : '';
  const section = sectionList.length ? `Contains sections: ${sectionList.join(', ')}` : '';
  const outro1 = 'Top quality text. Skip paragraph titles';
  const outro2 = `Detailed well written fruty description of ${d.race} in Fantasy style.`;

  const prompt = [intro, part1, part2, tag, section, outro1, outro2]
    .filter((v) => v)
    .map((part) => capitalize(part))
    .join('. ');

  return prompt;
};

export const derivePrimaryImagePath = (character: ICharacter, thump: number | boolean = false) => {
  const portrait = character['@expand']?.portraits?.[0];
  if (!portrait) return '';
  const thumbnail = thump ? `?thumb=${thump}x${thump}` : '';
  return `${PORTRAITS_IMAGE_PATH}/${portrait.id}/${portrait.image}?${thumbnail}`;
};

export const getGenderIcon = (gender: string) => {
  if (gender === 'male') return '♂️';
  if (gender === 'female') return '♀️';
  return '';
};

export const saveLocally = (character: ICharacter) => {
  const data = JSON.stringify(character);
  localStorage.setItem(`deorum-character-${character.id}`, data);
};

export const getLocalCopy = (id: string) => {
  const data = localStorage.getItem(`deorum-character-${id}`);
  if (!data) return null;
  return JSON.parse(data) as ICharacter;
};
