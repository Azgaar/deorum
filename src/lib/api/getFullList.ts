import type { IPortrait, IColor, ITag, IStyle, IOriginal, IQuality } from '$lib/types/api.types';
import client from '$lib/api/client';
import { BATCH_SIZE } from '$lib/config';

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  quality: IQuality[];
  colors: IColor[];
  tags: ITag[];
  styles: IStyle[];
}

export async function getFullList<K extends keyof IData>(name: K) {
  return client.records.getFullList(name, BATCH_SIZE) as unknown as IData[K];
}
