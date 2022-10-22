import { getFullList } from '$lib/api/getFullList';
import { cache, expiration } from '$lib/cache/cacheInstance';
import { MATCH_TAGS_NUMBER } from '$lib/config';
import { getRandomElements, getRandomIndex } from '$lib/utils/array';
import { error } from '@sveltejs/kit';
import { makePOJO } from '$lib/utils/object';

import type { IPortrait, ITag } from '$lib/types/api.types';

const getCached = async <T>(collection: 'portraits' | 'tags', filter?: string): Promise<T[]> => {
  const cached = cache.get(collection);
  if (cached) return new Promise((resolve) => resolve(cached));

  const list = (await getFullList(collection, filter)) as T[];
  cache.put(collection, list, expiration);
  return list;
};

const selectRandomTags = (existingTags: string[], allTags: ITag[]): ITag[] => {
  const randomExistingTag = existingTags[getRandomIndex(existingTags.length)];
  const firstTag = allTags.find(({ id }) => id === randomExistingTag);
  if (!firstTag) throw new Error(`No tag found with id ${randomExistingTag}`);

  const randomTags = getRandomElements(allTags, MATCH_TAGS_NUMBER - 1);
  return [firstTag, ...randomTags];
};

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const [portraits, tags] = await Promise.all([
    getCached<IPortrait>('portraits', 'active=true&&quality>6'),
    getCached<ITag>('tags')
  ]);

  const currentId = params.slug || portraits[getRandomIndex(portraits.length)].id;
  const current = portraits.find(({ id }) => id === currentId);

  if (!current) return error(404, `No portrait found with id ${currentId}`);

  const randomTags = selectRandomTags(current.tags, tags);
  const next = portraits[getRandomIndex(portraits.length)];

  console.log(
    `Match portrait ${current.id} with tags ${randomTags.map(({ name }) => name).join(', ')}`
  );
  return { current: makePOJO(current), next: makePOJO(next), tags: makePOJO(randomTags) };
};
