import { json } from '@sveltejs/kit';
import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IArchetype } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name }: IArchetype) => ({ id, name });

export const GET: RequestHandler = async () => {
  try {
    const rawArchetypes = await getCachedList<IArchetype>('archetypes');
    const archetypes = rawArchetypes.map(purgeData);

    log('archetypes', `Loading all archetypes`);
    return json(archetypes);
  } catch (err) {
    report('archetypes', err);
    throw createServerError(err);
  }
};
