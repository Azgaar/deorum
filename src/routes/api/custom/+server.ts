import admin from '$lib/api/admin';
import { authorize } from '$lib/api/auth';
import { getCachedList, getCachedPage, invalidateCache } from '$lib/cache/cacheInstance';
import type { ICharacter } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '../characters/$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page'));
    const pageSize = Number(url.searchParams.get('pageSize'));

    const filters = url.searchParams.getAll('filter');
    const sort = url.searchParams.get('sort') || '';
    const expand = url.searchParams.get('expand') || '';

    if (page) {
      if (!pageSize) throw error(400, 'Page size is not defined');
      const args = [page, pageSize, filters, sort, expand] as const;
      const customCharactersPage = await getCachedPage<ICharacter>('custom', ...args);
      return json(customCharactersPage);
    }

    const allCustomCharacters = await getCachedList<ICharacter>('custom', filters, sort, expand);
    return json(allCustomCharacters);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const data = await request.json();
    const customCharacter = await admin.records.create('custom', data);

    invalidateCache('custom', data.creator);
    log('custom', `Create custom character ${customCharacter.id}`, data);
    return json(customCharacter);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};
