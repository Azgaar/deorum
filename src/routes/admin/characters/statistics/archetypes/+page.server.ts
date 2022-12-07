import { getFullList } from '$lib/api/getFullList';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const [characters, archetypes] = await Promise.all([
    getFullList('characters'),
    getFullList('archetypes')
  ]);
  const archetypesMap = new Map(archetypes.map(({ id, name }) => [id, { name }]));

  // aggregate data
  const aggregated = characters.reduce((acc, { archetype }) => {
    if (!acc[archetype]) acc[archetype] = 0;
    acc[archetype] += 1;

    return acc;
  }, {} as { [race: string]: number });

  for (const { id } of archetypes) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => {
      const { name } = archetypesMap.get(id) || {};
      return { name, count };
    })
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
