import { json } from '@sveltejs/kit';
import { report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList } from '$lib/cache/cacheInstance';
import { concatImgSrc } from '$lib/utils/url';

import type { IRace } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

const purgeData = ({
  id,
  name,
  image,
  ageMean,
  ageDeviation,
  ageMin,
  ageMax,
  heightMean,
  heightDeviation,
  heightGenderDeviation,
  weightMean,
  weightDeviation,
  weightGenderDeviation
}: IRace) => ({
  id,
  name,
  image: concatImgSrc('races', id, image),
  ageMean,
  ageDeviation,
  ageMin,
  ageMax,
  heightMean,
  heightDeviation,
  heightGenderDeviation,
  weightMean,
  weightDeviation,
  weightGenderDeviation
});

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IRace>('races');
    const races = data.map(purgeData);
    return json(races);
  } catch (err) {
    report('races', err);
    throw createServerError(err);
  }
};
