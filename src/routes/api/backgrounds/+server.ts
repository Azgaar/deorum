import { json } from '@sveltejs/kit';
import { report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IBackground } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name }: IBackground) => ({ id, name });

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IBackground>('backgrounds');
    const backgrounds = data.map(purgeData);
    return json(backgrounds);
  } catch (err) {
    report('backgrounds', err);
    throw createServerError(err);
  }
};
