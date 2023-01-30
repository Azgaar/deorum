import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IQuality } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const quality = await getCachedList<IQuality[]>('quality');
    log('quality', `Loading all quality`);
    return new Response(JSON.stringify(quality));
  } catch (err) {
    report('quality', err);
    throw createServerError(err);
  }
};
