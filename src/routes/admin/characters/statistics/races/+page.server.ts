import { toJson } from '$lib/utils/requests';

import type { ICharacter, IRace } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/40';

export const load: import('./$types').PageServerLoad = async ({ fetch }) => {
  const [characters, races] = await Promise.all([
    toJson<ICharacter[]>(fetch('/api/characters')),
    toJson<IRace[]>(fetch('/api/races'))
  ]);

  const aggregated = characters.reduce((acc, { race }) => {
    if (!acc[race]) acc[race] = 0;
    acc[race] += 1;

    return acc;
  }, {} as { [race: string]: number });

  for (const { id } of races) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const racesMap = new Map(races.map(({ id, image, name }) => [id, { image, name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => {
      const { name, image = PLACEHOLDER_IMAGE } = racesMap.get(id) || {};
      return { name, image, count };
    })
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
