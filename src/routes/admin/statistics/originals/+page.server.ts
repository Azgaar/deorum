import structuredClone from '@ungap/structured-clone';

import type { IOriginal, IPortrait, IStyle, ITag } from '$lib/api.types';
import client from '$lib/api/client';
import { colorsMap, numbersMap } from '$lib/config';

const BATCH = 200;

export const csr = false;

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  tags: ITag[];
  styles: IStyle[];
}

interface IAggregatedData {
  [originId: string]: {
    portraits: number;
    quality: { [quality: number]: number };
    colors: { [color: string]: number };
    tags: { [tag: string]: number };
    styles: { [style: string]: number };
  };
}

const initial: IAggregatedData['originId'] = {
  portraits: 0,
  quality: {},
  colors: {},
  tags: {},
  styles: {}
};

function sortObject(obj: Record<string, number>, byKey = false) {
  if (byKey) return Object.entries(obj).sort(([a], [b]) => b.localeCompare(a));
  return Object.entries(obj).sort(([, a], [, b]) => b - a);
}

async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH) as unknown as IData[K];
}

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, originals, tags, styles] = await Promise.all([
    getFullList('portraits'),
    getFullList('originals'),
    getFullList('tags'),
    getFullList('styles')
  ]);

  const originalsMap = new Map(originals.map(({ id, image, name }) => [id, { name, image }]));
  const tagsMap = new Map(tags.map(({ id, image, name }) => [id, { image, name }]));
  const stylesMap = new Map(styles.map(({ id, image, name }) => [id, { image, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { original, quality, colors, tags, styles }) => {
    if (!acc[original]) acc[original] = structuredClone(initial);
    acc[original].portraits++;

    if (!acc[original].quality[quality]) acc[original].quality[quality] = 0;
    acc[original].quality[quality]++;

    for (const color of colors) {
      if (!acc[original].colors[color]) acc[original].colors[color] = 0;
      acc[original].colors[color]++;
    }

    for (const tag of tags) {
      if (!acc[original].tags[tag]) acc[original].tags[tag] = 0;
      acc[original].tags[tag]++;
    }

    for (const style of styles) {
      if (!acc[original].styles[style]) acc[original].styles[style] = 0;
      acc[original].styles[style]++;
    }

    return acc;
  }, {} as IAggregatedData);

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, { portraits, quality, colors, tags, styles }]) => ({
      original: { id, ...originalsMap.get(id) },
      portraits,
      quality: sortObject(quality, true).map(([name, count]) => ({
        ...numbersMap.get(name),
        count
      })),
      averageQuality:
        Object.entries(quality).reduce((acc, [quality, count]) => acc + +quality * count, 0) /
        portraits,
      colors: sortObject(colors).map(([name, count]) => ({ ...colorsMap.get(name), count })),
      tags: sortObject(tags).map(([tagId, count]) => ({ ...tagsMap.get(tagId), count })),
      styles: sortObject(styles).map(([styleId, count]) => ({ ...stylesMap.get(styleId), count }))
    }))
    .sort((a, b) => b.portraits - a.portraits);

  return { statistics };
};

interface IStatData {
  count: number;
  image?: string | undefined;
  name?: string | undefined;
}

export interface IStatistics {
  original: { id: string; name?: string | undefined; image?: string | undefined };
  portraits: number;
  quality: IStatData[];
  averageQuality: number;
  colors: IStatData[];
  tags: IStatData[];
  styles: IStatData[];
}
