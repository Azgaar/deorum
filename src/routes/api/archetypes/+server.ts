import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IArchetype } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const archetypes = await getCachedList<IArchetype[]>('archetypes');
    log('archetypes', `Loading all archetypes`);
    return new Response(JSON.stringify(archetypes));
  } catch (err) {
    report('archetypes', err);
    throw createServerError(err);
  }
};
