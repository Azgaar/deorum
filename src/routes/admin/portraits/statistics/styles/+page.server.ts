import { getFullList } from '$lib/api/getFullList';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, styles] = await Promise.all([getFullList('portraits'), getFullList('styles')]);
  const stylesMap = new Map(styles.map(({ id, image, name }) => [id, { image, name }]));

  // aggregate data
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

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...stylesMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
