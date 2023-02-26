import { json } from '@sveltejs/kit';
import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';
import { concatImgSrc } from '$lib/utils/url';

import type { IOriginal } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: IOriginal) => ({
  id,
  name,
  image: concatImgSrc('originals', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const rawOriginals = await getCachedList<IOriginal>('originals');
    const originals = rawOriginals.map(purgeData);
    log('originals', `Loading all originals`);
    return json(originals);
  } catch (err) {
    report('originals', err);
    throw createServerError(err);
  }
};
