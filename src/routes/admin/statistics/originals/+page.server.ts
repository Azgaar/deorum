import { getFullList } from '$lib/api/getFullList';
import type { IStatistics } from '$lib/types/statistics.types';
import { makePOJO } from '$lib/utils/object';

export const csr = false;

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

export const load: import('./$types').PageServerLoad = async () => {
  const [portraits, originals, tags, styles, colors, quality] = await Promise.all([
    getFullList('portraits'),
    getFullList('originals'),
    getFullList('tags'),
    getFullList('styles'),
    getFullList('colors'),
    getFullList('quality')
  ]);

  const originalsMap = new Map(originals.map(({ id, image, name }) => [id, { name, image }]));
  const tagsMap = new Map(tags.map(({ id, image, name }) => [id, { image, name }]));
  const stylesMap = new Map(styles.map(({ id, image, name }) => [id, { image, name }]));
  const colorsMap = new Map(colors.map(({ image, name }) => [name, { image, name }]));
  const qualityMap = new Map(quality.map(({ image, name }) => [name, { image, name }]));

  // aggregate data
  const aggregated = portraits.reduce((acc, { original, quality, colors, tags, styles }) => {
    if (!acc[original]) acc[original] = makePOJO(initial);
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

  const statistics: IStatsData[] = Object.entries(aggregated)
    .map(([id, { portraits, quality, colors, tags, styles }]) => ({
      original: { id, ...originalsMap.get(id), count: portraits },
      quality: sortObject(quality, true).map(([name, count]) => ({
        ...qualityMap.get(name),
        count
      })),
      averageQuality:
        Object.entries(quality).reduce((acc, [quality, count]) => acc + +quality * count, 0) /
        portraits,
      colors: sortObject(colors).map(([name, count]) => ({ ...colorsMap.get(name), count })),
      tags: sortObject(tags).map(([tagId, count]) => ({ ...tagsMap.get(tagId), count })),
      styles: sortObject(styles).map(([styleId, count]) => ({ ...stylesMap.get(styleId), count }))
    }))
    .sort((a, b) => b.original.count - a.original.count);

  return { statistics };
};

export interface IStatsData {
  original: IStatistics & { id: string };
  quality: IStatistics[];
  averageQuality: number;
  colors: IStatistics[];
  tags: IStatistics[];
  styles: IStatistics[];
}
