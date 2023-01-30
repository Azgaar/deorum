import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IStyle } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const styles = await getCachedList<IStyle[]>('styles');
    log('styles', `Loading all styles`);
    return new Response(JSON.stringify(styles));
  } catch (err) {
    report('styles', err);
    throw createServerError(err);
  }
};
