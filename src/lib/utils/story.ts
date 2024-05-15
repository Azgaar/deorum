import { sections } from '$lib/config/story';
import type { ICharacter } from '$lib/types/api.types';

export const createBasicPrompt = (
  character: ICharacter,
  tagsMap: Map<string, { name: string }>
) => {
  const { name, gender, age } = character;
  const { race, archetype, background, portraits } = character['@expand'];

  const data = {
    gender,
    race: race ? race.name : '',
    age: age ? `${age} years old` : null,
    name: name ? `Name: ${name}` : null,
    archetype: archetype ? `Nature (behaviour pattern): ${archetype.name}` : null,
    background: background ? `Background (origin): ${background.name}` : null
  };

  const tagList = character.tags.map((tag) => tagsMap.get(tag)?.name).filter(Boolean);
  const portrait = portraits?.[0].description;
  const sections = selectSections().join(', ');

  const intro = 'Write a realistic biography of a living fantasy character';
  const specie = `${data.gender} ${data.race}`.trim();
  const part1 = [specie, data.age].filter((v) => v).join(', ');
  const part2 = [data.name, data.archetype, data.background].filter((v) => v).join('. ');
  const tags =
    (tagList.length || portrait) && `Tags: ${tagList.join(', ')}${portrait ? `, ${portrait}` : ''}`;
  const section = `\n\nSections example: ${sections}. Remove section titles, and other sections on your choice`;
  const outro = `Detailed dry and factual description of a ${data.race} character.`;

  return [intro, part1, part2, tags, section, outro].filter(Boolean).join('. ');
};

function selectSections() {
  const selected = sections.filter((section) => Math.random() < section.chance);
  return selected
    .filter(({ excludes }) => {
      if (!excludes) return true;
      return excludes.every((exclude) => !selected.some(({ name }) => name === exclude));
    })
    .map(({ name }) => name);
}
