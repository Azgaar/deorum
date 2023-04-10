import { getElement, getFullList, getPage } from '$lib/api/getData';
import { makePOJO } from '$lib/utils/object';

import type { IListResult, TCollection } from '$lib/types/api.types';

import Cache from './cache';

export const cache = new Cache({ debug: false });

const EXPIRATION = 1000 * 60 * 60 * 6; // 6 hours

// DO NOT CALL FROM CLIENT SIDE
export const getCachedList = async <T>(
  collection: TCollection,
  filter = '',
  sort = '',
  expand = ''
): Promise<T[]> => {
  const key = [collection, filter, sort, expand, '$list'].join('-');

  const cached = cache.get(key);
  if (cached?.length) return new Promise((resolve) => resolve(cached));

  const fullList = (await getFullList(collection, filter, sort, expand)) as T[];
  const serialized = makePOJO(fullList);

  cache.put(key, serialized, EXPIRATION);
  return serialized;
};

// DO NOT CALL FROM CLIENT SIDE
export const getCachedPage = async <T>(
  collection: TCollection,
  page: number,
  pageSize: number,
  filter = '',
  sort = '',
  expand = ''
): Promise<IListResult<T>> => {
  const key = [collection, page, pageSize, filter, sort, expand, '$page'].join('-');

  const cached = cache.get(key);
  if (cached) return new Promise((resolve) => resolve(cached));

  const list = (await getPage(collection, page, pageSize, filter, sort, expand)) as IListResult<T>;
  const serialized = makePOJO(list);

  cache.put(key, serialized, EXPIRATION);
  return serialized;
};

// DO NOT CALL FROM CLIENT SIDE
export const getCachedElement = async <T>(
  collection: TCollection,
  id: string,
  expand = ''
): Promise<T> => {
  const key = [collection, id, expand, '$element'].join('-');

  const cached = cache.get(key);
  if (cached) return new Promise((resolve) => resolve(cached));

  const element = (await getElement(collection, id, expand)) as T;
  const serialized = makePOJO(element);

  cache.put(key, serialized, EXPIRATION);
  return serialized;
};

// DO NOT CALL FROM CLIENT SIDE
export const invalidateCache = (collection: string, ...args: string[]) => {
  cache.invalidate(collection, args);
};

// DO NOT CALL FROM CLIENT SIDE
export const updateCache = (
  collection: TCollection,
  id: string,
  partialValue: Record<string, unknown>
) => {
  cache.update(collection, id, partialValue);
};
