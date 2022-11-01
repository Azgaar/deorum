import { error, redirect } from '@sveltejs/kit';

import { getRandomIndex } from '$lib/utils/array';
import { makePOJO } from '$lib/utils/object';
import { getCachedList } from '$lib/cache/cacheInstance';
import { log } from '$lib/utils/log';

import type { IPortrait } from '$lib/types/api.types';

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const portraits = await getCachedList<IPortrait>(
    'portraits',
    'active=true&&quality>6&&name=null',
    '',
    'tags'
  );

  if (!portraits || !portraits.length) throw error(503, 'No portraits returned');

  const currentIndex = Boolean(params.slug) && portraits.findIndex(({ id }) => id === params.slug);
  if (currentIndex === false || currentIndex === -1) {
    const randomId = portraits[getRandomIndex(portraits.length)].id;
    throw redirect(307, `/match/names/${randomId}`);
  }

  const current = portraits[currentIndex];
  const next = portraits[getRandomIndex(portraits.length)];

  log('match', `Matching portrait ${current.id} with random names`);

  return { current: makePOJO(current), next: makePOJO(next) };
};
