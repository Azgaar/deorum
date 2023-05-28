import { toJson } from '$lib/utils/requests';

import type { IPortrait, IQuality } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

export const load: import('./$types').PageServerLoad = async ({ fetch }) => {
  const [portraits, quality] = await Promise.all([
    toJson<IPortrait[]>(fetch('/api/portraits')),
    toJson<IQuality[]>(fetch('/api/quality'))
  ]);

  const aggregated = portraits.reduce((acc, { quality }) => {
    if (!acc[quality]) acc[quality] = 0;
    acc[quality] += 1;

    return acc;
  }, {} as { [quality: string]: number });

  for (const { name } of quality) {
    if (!aggregated[name]) aggregated[name] = 0;
  }

  const qualityMap = new Map(quality.map(({ image, name }) => [name, { image, name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([name, count]) => ({ ...qualityMap.get(name), count }));

  return { statistics };
};
