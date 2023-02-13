import { json } from '@sveltejs/kit';

import { getCachedList } from '$lib/cache/cacheInstance';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';

import type { IStyle } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const rawStyles = await getCachedList<IStyle>('styles');
    const styles = rawStyles.map(({ id, name, image }) => ({
      id,
      name,
      image: concatImgSrc('styles', id, image)
    }));

    log('styles', `Loading all styles`);
    return json(styles);
  } catch (err) {
    report('styles', err);
    throw createServerError(err);
  }
};
