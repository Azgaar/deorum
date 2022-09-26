import PocketBase from 'pocketbase';

import { URL } from '$lib/config';
import type { IListResult, IPortrait } from '$lib/api.types';

const client = new PocketBase(URL);
const PAGE_SIZE = 100;

export async function fetchPortraits({
  page,
  filter,
  sort
}: {
  page: number;
  filter: string;
  sort: string;
}) {
  const portraitsList = (await client.records.getList('portraits', page, PAGE_SIZE, {
    filter,
    sort
  })) as unknown as IListResult<IPortrait>;

  const { items, totalPages } = portraitsList;
  return { items, totalPages };
}
