import { browser } from '$app/environment';
import { getElement, getFullList, getPage } from '$lib/api/getData';
import type { IList, TCollection } from '$lib/types/api.types';
import { log } from '$lib/utils/log';
import { makePOJO } from '$lib/utils/object';
import Cache from './cache';

export const cache = new Cache({ debug: false });

const EXPIRATION = 1000 * 60 * 60 * 6; // 6 hours

export const getCachedList = async <T>(
  collection: TCollection,
  filters: string[],
  sort = '',
  expand = ''
): Promise<T[]> => {
  if (browser) throw new Error('Should not be called from client side!');
  const key = createKey(collection, filters, sort, expand, '$list');

  const cached = cache.get(key);
  if (cached?.length) {
    log(collection, `getCachedList – got ${cached?.length} entries from cache`, key);
    return new Promise((resolve) => resolve(cached));
  }

  const fullList = (await getFullList(collection, filters, sort, expand)) as T[];
  const serialized = makePOJO(fullList);

  cache.put(key, serialized, EXPIRATION);
  log(collection, `getCachedList – got ${serialized?.length} entries from DB`, key);
  return serialized;
};

export const getCachedPage = async <T>(
  collection: TCollection,
  page: number,
  pageSize: number,
  filters: string[],
  sort = '',
  expand = ''
): Promise<IList<T>> => {
  if (browser) throw new Error('Should not be called from client side!');
  const key = createKey(collection, page, pageSize, filters, sort, expand, '$page');

  const cached = cache.get(key);
  if (cached) {
    log(
      collection,
      `getCachedPage – got 1 page out of ${cached.totalPages} with ${cached.items?.length} entries from cache`,
      key
    );
    return new Promise((resolve) => resolve(cached));
  }

  const list = (await getPage(collection, page, pageSize, filters, sort, expand)) as IList<T>;
  const serialized = makePOJO(list);

  cache.put(key, serialized, EXPIRATION);
  log(
    collection,
    `getCachedPage – got 1 page out of ${serialized.totalPages} with ${serialized.items?.length} entries from DB`,
    key
  );
  return serialized;
};

export const getCachedElement = async <T>(
  collection: TCollection,
  id: string,
  expand = ''
): Promise<T> => {
  if (browser) throw new Error('Should not be called from client side!');
  const key = createKey(collection, id, expand, '$element');

  const cached = cache.get(key);
  if (cached) {
    log(collection, 'getCachedElement – returned from cache', key);
    return new Promise((resolve) => resolve(cached));
  }

  const element = (await getElement(collection, id, expand)) as T;
  const serialized = makePOJO(element);

  cache.put(key, serialized, EXPIRATION);
  log(collection, 'getCachedElement – returned from DB', key);
  return serialized;
};

export const invalidateCache = (collection: string, ...args: string[]) => {
  if (browser) throw new Error('Should not be called from client side!');
  cache.invalidate(collection, args);
};

export const updateCache = (
  collection: TCollection,
  id: string,
  partialValue: Record<string, unknown>
) => {
  if (browser) throw new Error('Should not be called from client side!');
  cache.update(collection, id, partialValue);
};

function createKey(...args: unknown[]) {
  return args.filter(Boolean).join('-');
}
