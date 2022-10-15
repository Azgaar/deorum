import type { IOriginal, IPortrait, IStyle, ITag } from '$lib/api.types';
import client from '$lib/api/client';

const BATCH = 200;

export const csr = false;

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  tags: ITag[];
  styles: IStyle[];
}

interface IAggregatedData {
  [styleId: string]: number;
}

async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH) as unknown as IData[K];
}

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, styles] = await Promise.all([getFullList('portraits'), getFullList('styles')]);
  const stylesMap = new Map(styles.map(({ id, emoji, name }) => [id, { emoji, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { styles }) => {
    for (const style of styles) {
      if (!acc[style]) acc[style] = 0;
      acc[style] += 1;
    }

    return acc;
  }, {} as IAggregatedData);

  for (const { id } of styles) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...stylesMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};

export interface IStatistics {
  emoji?: string;
  name?: string;
  count: number;
}
