import { getCachedList } from '$lib/cache/cacheInstance';
import type { ITag } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: ITag) => ({
  id,
  name,
  image: concatImgSrc('tags', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<ITag>('tags');
    const tags = data.map(purgeData);
    return json(tags);
  } catch (err) {
    report('tags', err);
    throw createServerError(err);
  }
};
