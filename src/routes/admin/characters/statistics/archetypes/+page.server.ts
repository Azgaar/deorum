import { getCachedList } from '$lib/cache/cacheInstance';

import type { IStatistics } from '$lib/types/statistics.types';
import type { IArchetype, ICharacter } from '$lib/types/api.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const [characters, archetypes] = await Promise.all([
    getCachedList<ICharacter>('characters'),
    getCachedList<IArchetype>('archetypes')
  ]);

  const aggregated = characters.reduce((acc, { archetype }) => {
    if (!acc[archetype]) acc[archetype] = 0;
    acc[archetype] += 1;

    return acc;
  }, {} as { [race: string]: number });

  for (const { id } of archetypes) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const archetypesMap = new Map(archetypes.map(({ id, name }) => [id, { name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => {
      const { name } = archetypesMap.get(id) || {};
      return { name, count };
    })
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
