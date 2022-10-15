import type { IOriginal, IPortrait, IStyle, ITag } from '$lib/api.types';
import client from '$lib/api/client';
import { numbersMap, qualities } from '$lib/config';

const BATCH = 200;

export const csr = false;

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  tags: ITag[];
  styles: IStyle[];
}

interface IAggregatedData {
  [quality: string]: number;
}

async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH) as unknown as IData[K];
}

export const load: import('./$types').PageServerLoad = async () => {
  const portraits = await getFullList('portraits');

  // aggregate data
  const aggregated = portraits.reduce((acc, { quality }) => {
    if (!acc[quality]) acc[quality] = 0;
    acc[quality] += 1;

    return acc;
  }, {} as IAggregatedData);

  for (const quality of qualities) {
    if (!aggregated[quality]) aggregated[quality] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated).map(([id, count]) => ({
    emoji: numbersMap.get(id)?.emoji,
    count
  }));

  return { statistics };
};

export interface IStatistics {
  emoji?: string;
  count: number;
}
