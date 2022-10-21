import type { IPortrait } from '$lib/types/api.types';
import client from './client';

export async function getPortrait({ id, expand = '' }: { id: string; expand?: string }) {
  const portrait = (await client.records.getOne('portraits', id, {
    expand
  })) as unknown as IPortrait;

  return portrait;
}
