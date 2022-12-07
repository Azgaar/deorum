import { getFullList } from '$lib/api/getFullList';
import { genders } from '$lib/data/genders';

import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const characters = await getFullList('characters');

  // aggregate data
  const aggregated = characters.reduce((acc, { gender }) => {
    if (!acc[gender]) acc[gender] = 0;
    acc[gender] += 1;

    return acc;
  }, {} as { [race: string]: number });

  for (const gender of genders) {
    if (!aggregated[gender]) aggregated[gender] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
