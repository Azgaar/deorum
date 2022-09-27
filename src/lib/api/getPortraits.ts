import type { IListResult, IPortrait } from '$lib/api.types';
import client from './client';

const PAGE_SIZE = 100;

export async function getPortraits({
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
