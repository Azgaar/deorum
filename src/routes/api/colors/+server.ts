import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IColor } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const colors = await getCachedList<IColor[]>('colors');
    log('colors', `Loading all colors`);
    return new Response(JSON.stringify(colors));
  } catch (err) {
    report('colors', err);
    throw createServerError(err);
  }
};
