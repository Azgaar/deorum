import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IRace } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const races = await getCachedList<IRace[]>('races');
    log('races', `Loading all races`);
    return new Response(JSON.stringify(races));
  } catch (err) {
    report('races', err);
    throw createServerError(err);
  }
};
