import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IOriginal } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const originals = await getCachedList<IOriginal[]>('originals');
    log('originals', `Loading all originals`);
    return new Response(JSON.stringify(originals));
  } catch (err) {
    report('originals', err);
    throw createServerError(err);
  }
};
