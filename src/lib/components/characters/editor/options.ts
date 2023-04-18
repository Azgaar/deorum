import { genders } from '$lib/data/genders';
import type { IRace } from '$lib/types/api.types';

export const createOptions = (
  races: Map<string, IRace>,
  archetypes: Map<string, { name: string }>,
  backgrounds: Map<string, { name: string }>
) => {
  const genderOptions = compose(new Map(genders.map((v) => [v, { name: v }])), 'genders');
  const raceOptions = compose(races, 'races');
  const archetypeOptions = compose(archetypes, 'archetypes');
  const backgroundOptions = compose(backgrounds, 'backgrounds');

  return {
    gender: genderOptions,
    race: raceOptions,
    archetype: archetypeOptions,
    background: backgroundOptions
  };
};

function compose(map: Map<string, { name: string }>, category: string) {
  return [
    ['', 'common.values.undefined'],
    ...Array.from(map).map(([value, { name }]) => [value, `common.${category}.${name}`])
  ];
}
