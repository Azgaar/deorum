import type {
  IPortrait,
  IColor,
  ITag,
  IStyle,
  IOriginal,
  IQuality,
  IArchetype,
  IBackground,
  IRace,
  ICharacter
} from '$lib/types/api.types';
import admin from './admin';
import { BATCH_SIZE } from '$lib/config';

interface IData {
  portraits: IPortrait[];
  originals: IOriginal[];
  quality: IQuality[];
  colors: IColor[];
  tags: ITag[];
  styles: IStyle[];
  races: IRace[];
  archetypes: IArchetype[];
  backgrounds: IBackground[];
  characters: ICharacter[];
}

export async function getFullList<K extends keyof IData>(
  name: K,
  filter?: string,
  sort?: string,
  expand?: string
): Promise<IData[K]> {
  const options: { filter?: string; sort?: string; expand?: string } = {};
  if (filter) options.filter = filter;
  if (sort) options.sort = sort;
  if (expand) options.expand = expand;

  return admin.records.getFullList(name, BATCH_SIZE, options) as unknown as IData[K];
}
