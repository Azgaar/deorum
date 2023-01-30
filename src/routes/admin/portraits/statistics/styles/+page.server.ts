import { toJson } from '$lib/utils/requests';

import type { IPortrait, IStyle } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async ({ fetch }) => {
  const [portraits, styles] = await Promise.all([
    toJson<IPortrait[]>(fetch('/api/portraits')),
    toJson<IStyle[]>(fetch('/api/styles'))
  ]);

  const aggregated = portraits.reduce((acc, { styles }) => {
    for (const style of styles) {
      if (!acc[style]) acc[style] = 0;
      acc[style] += 1;
    }

    return acc;
  }, {} as { [styleId: string]: number });

  for (const { id } of styles) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const stylesMap = new Map(styles.map(({ id, image, name }) => [id, { image, name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...stylesMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
