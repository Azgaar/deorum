import { json } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';
import { concatImgSrc } from '$lib/utils/url';

import type { ITag } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: ITag) => ({
  id,
  name,
  image: concatImgSrc('tags', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const rawTags = await getCachedList<ITag>('tags');
    const tags = rawTags.map(purgeData);

    log('tags', `Loading all tags`);
    return json(tags);
  } catch (err) {
    report('tags', err);
    throw createServerError(err);
  }
};
