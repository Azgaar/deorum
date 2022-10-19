import { getFullList } from '$lib/api/getFullList';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, quality] = await Promise.all([
    getFullList('portraits'),
    getFullList('quality')
  ]);
  const qualityMap = new Map(quality.map(({ image, name }) => [name, { image, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { quality }) => {
    if (!acc[quality]) acc[quality] = 0;
    acc[quality] += 1;

    return acc;
  }, {} as { [quality: string]: number });

  for (const { name } of quality) {
    if (!aggregated[name]) aggregated[name] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([name, count]) => ({ ...qualityMap.get(name), count }));

  return { statistics };
};
