import type { IPortrait } from '$lib/types/api.types';

export const getGenderFromTags = (portrait: IPortrait) => {
  const tags = portrait['@expand'].tags;

  if (tags.find(({ name }) => name === 'female')) return 'female';
  if (tags.find(({ name }) => name === 'male')) return 'male';

  return Math.random() < 0.5 ? 'female' : 'male';
};

export const getRaceFromTags = (portrait: IPortrait) => {
  const tags = portrait['@expand'].tags;
  if (tags.find(({ name }) => name === 'dragon')) return 'dragonborn';
  if (tags.find(({ name }) => name === 'stone')) return 'troll';
  if (tags.find(({ name }) => name === 'long-eared')) return 'elf';
  if (tags.find(({ name }) => name === 'demonic')) return 'tiefling';

  return 'human';
};
