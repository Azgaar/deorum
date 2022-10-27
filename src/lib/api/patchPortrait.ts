import admin from './admin';
import { getPortrait } from './getPortrait';

export async function patchPortrait(id: string, add: boolean, tagId: string) {
  const portrait = await getPortrait({ id });
  const tags = portrait.tags || [];

  if (add && tags.includes(tagId)) return null;
  if (!add && !tags.includes(tagId)) return null;

  const newTags = add ? [...tags, tagId] : tags.filter((t) => t !== tagId);
  return await admin.records.update('portraits', id, { tags: newTags });
}
