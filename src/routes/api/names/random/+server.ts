import { log } from '$lib/utils/log';
import { getRandomNames } from '$lib/utils/random';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const quantity = Number(url.searchParams.get('quantity'));
  const names = getRandomNames(quantity);

  log('names', `Generating ${quantity} random names`);

  return new Response(JSON.stringify(names));
};
