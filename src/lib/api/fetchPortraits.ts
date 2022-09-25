import PocketBase from 'pocketbase';

import { URL } from '$lib/config';
import type { IListResult, IPortrait } from '$lib/api.types';

export const filter = 'active = true';
export const sort = '+original';
export const PAGE_SIZE = 100;

const client = new PocketBase(URL);

export async function fetchPortraits(page: number) {
  const portraitsList = (await client.records.getList('portraits', page, PAGE_SIZE, {
    filter,
    sort
  })) as unknown as IListResult<IPortrait>;

  const { items, totalPages } = portraitsList;
  return { items, totalPages };
}
