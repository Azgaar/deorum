import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IBackground } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const backgrounds = await getCachedList<IBackground[]>('backgrounds');
    log('backgrounds', `Loading all backgrounds`);
    return new Response(JSON.stringify(backgrounds));
  } catch (err) {
    report('backgrounds', err);
    throw createServerError(err);
  }
};
