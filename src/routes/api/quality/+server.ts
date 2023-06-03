import { getCachedList } from '$lib/cache/cacheInstance';
import type { IQuality } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: IQuality) => ({
  id,
  name,
  image: concatImgSrc('quality', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IQuality>('quality');
    const quality = data.map(purgeData);
    return json(quality);
  } catch (err) {
    report('quality', err);
    throw createServerError(err);
  }
};
