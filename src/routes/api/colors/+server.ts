import { getCachedList } from '$lib/cache/cacheInstance';
import type { IColor } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IColor>('colors');
    const colors = data.map(({ id, name, image }) => ({
      id,
      name,
      image: concatImgSrc('colors', id, image)
    }));
    return json(colors);
  } catch (err) {
    report('colors', err);
    throw createServerError(err);
  }
};
