import { error } from '@sveltejs/kit';

import { getCachedList } from '$lib/cache/cacheInstance';
import { filter, sort } from '../../../(guest)/gallery/+layout.server';
import { sliceElements } from '$lib/utils/array';
import { getRandomName } from '$lib/utils/random';

import type { IPortrait } from '$lib/types/api.types';
import type { RequestHandler } from './$types';
import type { IGalleryItem } from '$lib/types/gallery.types';

const LOADING_BATCH = 15;

export const GET: RequestHandler = async ({ url }) => {
  const portraits = await getCachedList<IPortrait>('portraits', filter, sort);
  if (!portraits || !portraits.length) throw error(503, 'No portraits returned');

  const edgeId = url.searchParams.get('edgeId');
  const right = url.searchParams.get('right') === 'true';

  const edgeIndex = portraits.findIndex(({ id }) => id === edgeId);
  if (edgeIndex === -1) throw error(503, 'Edge id is not found');

  const from = right ? edgeIndex + 1 : edgeIndex - LOADING_BATCH;
  const to = right ? edgeIndex + LOADING_BATCH + 1 : edgeIndex;
  const selection = sliceElements(portraits, from, to);

  const items: IGalleryItem[] = selection.map(({ id, image }) => ({
    id,
    image,
    name: getRandomName()
  }));

  console.info(`Loading ${LOADING_BATCH} more gallery items`);

  return new Response(JSON.stringify(items));
};
