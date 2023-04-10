import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import { t } from '$lib/locales/translations';
import type { ICharacter } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { report } from './log';

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
  const {
    id,
    name,
    gender,
    age,
    height,
    weight,
    bio,
    '@expand': expand,
    likes = [],
    creator
  } = character;
  const image = getCharacterImage(character);

  const race = expand.race?.name || '';
  const archetype = expand.archetype?.name || '';
  const background = expand.background?.name || '';

  return {
    id,
    image,
    name,
    race,
    gender,
    archetype,
    background,
    age,
    weight,
    height,
    bio,
    likes,
    creator
  };
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
