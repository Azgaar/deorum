import { getCachedList } from '$lib/cache/cacheInstance';
import type { IArchetype } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name }: IArchetype) => ({ id, name });

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IArchetype>('archetypes');
    const archetypes = data.map(purgeData);
    return json(archetypes);
  } catch (err) {
    report('archetypes', err);
    throw createServerError(err);
  }
};
