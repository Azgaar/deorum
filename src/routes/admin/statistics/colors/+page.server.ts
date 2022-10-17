import type { IOriginal, IPortrait, IStyle, ITag } from '$lib/api.types';
import client from '$lib/api/client';
import { colors, colorsMap } from '$lib/config';

const BATCH = 200;

export const csr = false;

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  tags: ITag[];
  styles: IStyle[];
}

interface IAggregatedData {
  [color: string]: number;
}

async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH) as unknown as IData[K];
}

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits] = await Promise.all([getFullList('portraits'), getFullList('styles')]);

  // aggregate data
  const aggregated = portraits.reduce((acc, { colors }) => {
    for (const color of colors) {
      if (!acc[color]) acc[color] = 0;
      acc[color] += 1;
    }

    return acc;
  }, {} as IAggregatedData);

  for (const color of colors) {
    if (!aggregated[color]) aggregated[color] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...colorsMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};

export interface IStatistics {
  emoji?: string;
  image?: string;
  name?: string;
  count: number;
}
