import type { IPortrait } from '$lib/types/api.types';
import { sendFormData } from '$lib/utils/requests';
import admin from './admin';
import { convertImageUrl } from '../utils/images';
import { getPortrait } from './getPortrait';

export async function patchPortraitTags(id: string, add: boolean, tagId: string) {
  const portrait = await getPortrait({ id });
  const tags = portrait.tags || [];

  if (add && tags.includes(tagId)) return null;
  if (!add && !tags.includes(tagId)) return null;

  const newTags = add ? [...tags, tagId] : tags.filter((t) => t !== tagId);
  return await admin.records.update('portraits', id, { tags: newTags });
}

export async function patchPortraitName(id: string, name: string) {
  return await admin.records.update('portraits', id, { name });
}

export async function patchPortraitImage(id: string, src: string) {
  const imageFile = await convertImageUrl(src);
  const formData = new FormData();
  formData.set('image', imageFile);

  const result = await sendFormData<IPortrait>(`/api/portraits/${id}/image`, formData, 'PATCH');
  return result;
}
