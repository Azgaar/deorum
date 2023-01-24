import type { RequestHandler } from '@sveltejs/kit';

import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { getCachedList } from '$lib/cache/cacheInstance';
import type { IPortrait } from '$lib/types/api.types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const filter = url.searchParams.get('filter') || '';
    const sort = url.searchParams.get('sort') || '';
    const expand = url.searchParams.get('expand') || '';

    const portraits = await getCachedList<IPortrait>('portraits', filter, sort, expand);
    log('portraits', `Loading all portraits`);
    return new Response(JSON.stringify(portraits));
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};
