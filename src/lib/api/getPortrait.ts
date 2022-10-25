import type { IPortrait } from '$lib/types/api.types';
import admin from './admin';

export async function getPortrait({ id, expand = '' }: { id: string; expand?: string }) {
  const portrait = await admin.records.getOne('portraits', id, { expand });
  return portrait as unknown as IPortrait;
}
