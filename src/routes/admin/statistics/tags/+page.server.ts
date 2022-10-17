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
  [tagId: string]: number;
}

async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH) as unknown as IData[K];
}

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, tags] = await Promise.all([getFullList('portraits'), getFullList('tags')]);
  const tagsMap = new Map(tags.map(({ id, emoji, image, name }) => [id, { emoji, image, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { tags }) => {
    for (const tag of tags) {
      if (!acc[tag]) acc[tag] = 0;
      acc[tag] += 1;
    }

    return acc;
  }, {} as IAggregatedData);

  for (const { id } of tags) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => ({ ...tagsMap.get(id), count }))
    .sort((a, b) => b.count - a.count);

  return { statistics };
};

export interface IStatistics {
  emoji?: string;
  image?: string;
  name?: string;
  count: number;
}
