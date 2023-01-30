import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { ITag } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const tags = await getCachedList<ITag[]>('tags');
    log('tags', `Loading all tags`);
    return new Response(JSON.stringify(tags));
  } catch (err) {
    report('tags', err);
    throw createServerError(err);
  }
};
