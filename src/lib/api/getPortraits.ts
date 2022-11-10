import type { IListResult, IPortrait } from '$lib/types/api.types';
import admin from './admin';

const PAGE_SIZE = 100;

export async function getPortraits({
  page,
  perPage = PAGE_SIZE,
  filter = '',
  sort = '',
  expand = ''
}: {
  page: number;
  perPage?: number;
  filter?: string;
  sort?: string;
  expand?: string;
}) {
  const portraitsList = (await admin.records.getList('portraits', page, perPage, {
    filter,
    sort,
    expand
  })) as unknown as IListResult<IPortrait>;

  return portraitsList;
}
