import admin from './admin';
import { BATCH_SIZE } from '$lib/config';

// admin based actions, run on server only!

type TRequestOptions = {
  filter?: string;
  sort?: string;
  expand?: string;
};

export async function getElement(name: string, id: string, expand?: string) {
  const options: TRequestOptions = {};
  if (expand) options.expand = expand;

  return admin.records.getOne(name, id, options);
}

export async function getPage(
  name: string,
  page: number,
  perPage: number,
  filters?: string[],
  sort?: string,
  expand?: string
) {
  const options: TRequestOptions = {};
  if (filters) options.filter = filters.join('&&');
  if (sort) options.sort = sort;
  if (expand) options.expand = expand;

  return admin.records.getList(name, page, perPage, options);
}

export async function getFullList(
  name: string,
  filters?: string[],
  sort?: string,
  expand?: string
) {
  const options: TRequestOptions = {};
  if (filters) options.filter = filters.join('&&');
  if (sort) options.sort = sort;
  if (expand) options.expand = expand;

  return admin.records.getFullList(name, BATCH_SIZE, options);
}
