import { getFullList } from '$lib/api/getFullList';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

interface IAggregatedData {
  [color: string]: number;
}

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, colors] = await Promise.all([getFullList('portraits'), getFullList('colors')]);
  const colorsMap = new Map(colors.map(({ image, name }) => [name, { image, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { colors }) => {
    for (const color of colors) {
      if (!acc[color]) acc[color] = 0;
      acc[color] += 1;
    }

    return acc;
  }, {} as IAggregatedData);

  for (const { name } of colors) {
    if (!aggregated[name]) aggregated[name] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([name, count]) => ({ ...colorsMap.get(name), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
