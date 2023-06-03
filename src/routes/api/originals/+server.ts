import { getCachedList } from '$lib/cache/cacheInstance';
import type { IOriginal } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: IOriginal) => ({
  id,
  name,
  image: concatImgSrc('originals', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IOriginal>('originals');
    const originals = data.map(purgeData);
    return json(originals);
  } catch (err) {
    report('originals', err);
    throw createServerError(err);
  }
};
