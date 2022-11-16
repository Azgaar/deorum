import { getFullList } from '$lib/api/getFullList';
import Cache from './cache';

export const cache = new Cache({ debug: false });

const EXPIRATION = 1000 * 60 * 60 * 6; // 6 hours

export const getCachedList = async <T>(
  collection: 'portraits' | 'tags' | 'characters',
  filter = '',
  sort = '',
  expand = ''
): Promise<T[]> => {
  const key = [collection, filter, sort, expand].join('-');

  const cached = cache.get(key);
  if (cached?.length) return new Promise((resolve) => resolve(cached));

  const list = (await getFullList(collection, filter, sort, expand)) as T[];
  cache.put(key, list, EXPIRATION);
  return list;
};
