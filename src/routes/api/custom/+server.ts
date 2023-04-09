import { json, error } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { getCachedList, getCachedPage } from '$lib/cache/cacheInstance';
import { createServerError } from '$lib/utils/errors';

import type { ICharacter } from '$lib/types/api.types';
import type { RequestHandler } from '../characters/$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page'));
    const pageSize = Number(url.searchParams.get('pageSize'));

    const filter = url.searchParams.get('filter') || '';
    const sort = url.searchParams.get('sort') || '';
    const expand = url.searchParams.get('expand') || '';

    if (page) {
      if (!pageSize) throw error(400, 'Page size is not defined');
      const args = [page, pageSize, filter, sort, expand] as const;
      const customCharactersPage = await getCachedPage<ICharacter>('custom', ...args);
      log('custom', `Loading ${pageSize} custom characters`);
      return json(customCharactersPage);
    }

    const allCustomCharacters = await getCachedList<ICharacter>('custom', filter, sort, expand);
    log('custom', `Loading all custom characters`);
    return json(allCustomCharacters);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};
