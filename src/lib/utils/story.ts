import { sections } from '$lib/data/sections';
import type { ICharacter } from '$lib/types/api.types';
import { capitalize } from './string';

const getTags = (character: ICharacter, tags: Map<string, { name: string }>): string[] => {
  if (!character.tags.length) return [];
  const tagNames = character.tags.map((tag) => tags.get(tag)?.name);
  return tagNames.filter((tagName) => tagName) as string[];
};

const selectSections = (): string[] => {
  const selected = sections.filter((section) => Math.random() < section.chance);
  return selected
    .filter(({ excludes }) => {
      if (!excludes) return true;
      return excludes.every((exclude) => !selected.some(({ name }) => name === exclude));
    })
    .map(({ name }) => name);
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
  const sections = selectSections().join(', ');

  const intro = 'Write a fictional biography of a living fantasy character';
  const specie = `${d.gender} ${d.race}`.trim();
  const part1 = [specie, d.age].filter((v) => v).join(', ');
  const part2 = [d.name, d.archetype, d.background].filter((v) => v).join('. ');
  const tag = tagList.length ? `Tags: ${tagList.join(', ')}` : '';
  const section = `Example sections: ${sections}, and other sections you may want to add`;
  const outro1 = 'Top quality text in present tense, no typos, best grammar, no cliches';
  const outro2 = `Detailed well-written fruity description of a ${d.race} character. Remove section titles`;

  const prompt = [intro, part1, part2, tag, section, outro1, outro2]
    .filter((v) => v)
    .map((part) => capitalize(part))
    .join('. ');

  return prompt;
};
