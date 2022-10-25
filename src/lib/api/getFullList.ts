import type { IPortrait, IColor, ITag, IStyle, IOriginal, IQuality } from '$lib/types/api.types';
import admin from './admin';
import { BATCH_SIZE } from '$lib/config';

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  quality: IQuality[];
  colors: IColor[];
  tags: ITag[];
  styles: IStyle[];
}

export async function getFullList<K extends keyof IData>(
  name: K,
  filter?: string,
  sort?: string
): Promise<IData[K]> {
  const options: { filter?: string; sort?: string } = {};
  if (filter) options.filter = filter;
  if (sort) options.sort = sort;

  return admin.records.getFullList(name, BATCH_SIZE, options) as unknown as IData[K];
}
