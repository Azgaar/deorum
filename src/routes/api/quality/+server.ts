import { json } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';
import { concatImgSrc } from '$lib/utils/url';

import type { IQuality } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: IQuality) => ({
  id,
  name,
  image: concatImgSrc('quality', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const rawQuality = await getCachedList<IQuality>('quality');
    const quality = rawQuality.map(purgeData);

    log('quality', `Loading all quality`);
    return json(quality);
  } catch (err) {
    report('quality', err);
    throw createServerError(err);
  }
};
