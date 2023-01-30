import admin from './admin';
import { BATCH_SIZE } from '$lib/config';

// admin based action, run on server only!

export async function getElement(name: string, id: string, expand?: string) {
  const options: { expand?: string } = {};
  if (expand) options.expand = expand;

  return admin.records.getOne(name, id, options);
}

export async function getPage(
  name: string,
  page: number,
  perPage: number,
  filter?: string,
  sort?: string,
  expand?: string
) {
  const options: { filter?: string; sort?: string; expand?: string } = {};
  if (filter) options.filter = filter;
  if (sort) options.sort = sort;
  if (expand) options.expand = expand;

  return admin.records.getList(name, page, perPage, options);
}

export async function getFullList(name: string, filter?: string, sort?: string, expand?: string) {
  const options: { filter?: string; sort?: string; expand?: string } = {};
  if (filter) options.filter = filter;
  if (sort) options.sort = sort;
  if (expand) options.expand = expand;

  return admin.records.getFullList(name, BATCH_SIZE, options);
}
