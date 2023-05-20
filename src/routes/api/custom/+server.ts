import { json, error } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { getCachedList, getCachedPage, invalidateCache } from '$lib/cache/cacheInstance';
import { createServerError } from '$lib/utils/errors';

import type { ICharacter } from '$lib/types/api.types';
import type { RequestHandler } from '../characters/$types';
import admin from '$lib/api/admin';
import { authorize } from '$lib/api/auth';
import { CREATE_CHARACTER_PRICE } from '$lib/config/coins';

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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    if (!coinsLeft || coinsLeft < CREATE_CHARACTER_PRICE) throw error(403, 'Not enought coins');

    const data = await request.json();
    const customCharacter = await admin.records.create('custom', data);

    const coins = coinsLeft - CREATE_CHARACTER_PRICE;
    await client.records.update('profiles', user.profile.id, { coins });

    invalidateCache('custom', data.creator);
    log('custom', `Create custom character ${customCharacter.id}`, data);
    return json(customCharacter);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};
