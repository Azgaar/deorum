import { getCachedList } from '$lib/cache/cacheInstance';

import type { IPortrait, ITag } from '$lib/types/api.types';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, tags] = await Promise.all([
    getCachedList<IPortrait>('portraits'),
    getCachedList<ITag>('tags')
  ]);

  const aggregated = portraits.reduce((acc, { tags }) => {
    for (const tag of tags) {
      if (!acc[tag]) acc[tag] = 0;
      acc[tag] += 1;
    }

    return acc;
  }, {} as { [tagId: string]: number });

  for (const { id } of tags) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const tagsMap = new Map(tags.map(({ id, image, name }) => [id, { image, name }]));
  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...tagsMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
