import { error } from '@sveltejs/kit';

import { getFullList } from '$lib/api/getFullList';
import { cache, expiration } from '$lib/cache/cacheInstance';
import { MATCH_TAGS_NUMBER } from '$lib/config';
import { getRandomElements, getRandomIndex, shuffle } from '$lib/utils/array';
import { makePOJO } from '$lib/utils/object';

import type { IPortrait, ITag } from '$lib/types/api.types';

const getCachedList = async <T>(
  collection: 'portraits' | 'tags',
  filter?: string
): Promise<T[]> => {
  const cached = cache.get(collection);
  if (cached?.length) return new Promise((resolve) => resolve(cached));

  const list = (await getFullList(collection, filter)) as T[];
  cache.put(collection, list, expiration);
  return list;
};

const selectRandomTags = (currentTags: string[], allTags: ITag[]): ITag[] => {
  const randomExistingTags = getRandomElements(currentTags, Math.min(2, currentTags.length));

  const existingTags: ITag[] = [];
  const otherTags: ITag[] = [];

  allTags.forEach((tag) => {
    if (randomExistingTags.includes(tag.id)) existingTags.push(tag);
    else otherTags.push(tag);
  });

  const randomTags = getRandomElements(otherTags, MATCH_TAGS_NUMBER - existingTags.length);
  return shuffle([...existingTags, ...randomTags]);
};

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const [portraits, tags] = await Promise.all([
    getCachedList<IPortrait>('portraits', 'active=true&&quality>6'),
    getCachedList<ITag>('tags')
  ]);

  if (!portraits || !portraits.length) throw error(503, 'No portraits returned');
  if (!tags || !tags.length) throw error(503, 'No tags returned');

  const currentId = params.slug || portraits[getRandomIndex(portraits.length)].id;
  const current = portraits?.find(({ id }) => id === currentId);

  if (!current) return error(404, `No portrait found with id ${currentId}`);

  const randomTags = selectRandomTags(current.tags, tags);
  const next = portraits[getRandomIndex(portraits.length)];

  console.log(
    `Match portrait ${current.id} with tags ${randomTags.map(({ name }) => name).join(', ')}`
  );
  return { current: makePOJO(current), next: makePOJO(next), tags: makePOJO(randomTags) };
};
