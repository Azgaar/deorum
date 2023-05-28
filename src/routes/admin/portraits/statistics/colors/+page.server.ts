import { toJson } from '$lib/utils/requests';

import type { IColor, IPortrait } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

interface IAggregatedData {
  [color: string]: number;
}

export const load: import('./$types').PageServerLoad = async ({ fetch }) => {
  const [portraits, colors] = await Promise.all([
    toJson<IPortrait[]>(fetch('/api/portraits')),
    toJson<IColor[]>(fetch('/api/colors'))
  ]);

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

  const colorsMap = new Map(colors.map(({ image, name }) => [name, { image, name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([name, count]) => ({ ...colorsMap.get(name), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
