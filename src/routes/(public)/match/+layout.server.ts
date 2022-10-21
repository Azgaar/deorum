import { getFullList } from '$lib/api/getFullList';
import { cache, expiration } from '$lib/cache/cacheInstance';
import type { IPortrait, ITag } from '$lib/types/api.types';
import { error } from '@sveltejs/kit';

const getCached = async <T>(collection: 'portraits' | 'tags', filter?: string): Promise<T[]> => {
  const cached = cache.get(collection);
  if (cached) return new Promise((resolve) => resolve(cached));

  const list = (await getFullList(collection, filter)) as T[];
  cache.put(collection, list, expiration);
  return list;
};

const getRandomIndex = (length: number): number => {
  return Math.floor(Math.random() * length);
};

const makePOJO = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object));
};

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const [portraits, tags] = await Promise.all([
    getCached<IPortrait>('portraits', 'active=true&&quality>6'),
    getCached<ITag>('tags')
  ]);

  const currentId = params.slug || portraits[getRandomIndex(portraits.length)].id;
  const current = portraits.find(({ id }) => id === currentId);

  if (!current) return error(404, `No portrait found with id ${currentId}`);

  const next = portraits[getRandomIndex(portraits.length)];

  console.log(
    JSON.stringify({
      portraits: portraits.length,
      tags: tags.length,
      current: current.id,
      next: next.id
    })
  );

  return { current: makePOJO(current), next: makePOJO(next) };
};
