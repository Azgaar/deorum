import { json } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';
import { concatImgSrc } from '$lib/utils/url';

import type { IColor } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const rawColors = await getCachedList<IColor>('colors');
    const colors = rawColors.map(({ id, name, image }) => ({
      id,
      name,
      image: concatImgSrc('colors', id, image)
    }));

    log('colors', `Loading all colors`);
    return json(colors);
  } catch (err) {
    report('colors', err);
    throw createServerError(err);
  }
};
