import { genders } from '$lib/data/genders';
import { toJson } from '$lib/utils/requests';

import type { ICharacter } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async ({ fetch }) => {
  const characters = await toJson<ICharacter[]>(fetch('/api/characters'));

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
