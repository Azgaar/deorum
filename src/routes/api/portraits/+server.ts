import admin from '$lib/api/admin';
import { authorize } from '$lib/api/auth';
import { getCachedList, getCachedPage, invalidateCache } from '$lib/cache/cacheInstance';
import { UPLOAD_PORTRAIT_PRICE } from '$lib/config/coins';
import type { IPortrait } from '$lib/types/api.types';
import type { IChange } from '$lib/types/editor.types';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { getNewValue } from '$lib/utils/portraits';
import { pluralize } from '$lib/utils/string';
import { error, json, type RequestHandler } from '@sveltejs/kit';

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
      const portraitsPage = await getCachedPage<IPortrait>('portraits', ...args);
      return json(portraitsPage);
    }

    const portraits = await getCachedList<IPortrait>('portraits', filters, sort, expand);
    return json(portraits);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    if (!coinsLeft || coinsLeft < UPLOAD_PORTRAIT_PRICE) throw error(403, 'Not enought coins');

    const formData = await request.formData();
    const result = await admin.records.create('portraits', formData);

    const coins = coinsLeft - UPLOAD_PORTRAIT_PRICE;
    await client.records.update('profiles', user.profile.id, { coins });

    invalidateCache('portraits');
    log('portraits', 'Upload portrait');
    return json(result);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};

export const PATCH: RequestHandler = async ({ request }) => {
  try {
    const { ids, changes, patches } = (await request.json()) as {
      ids: string[];
      changes: IChange[];
      patches: { id: string; patchData: Partial<IPortrait> }[];
    };

    if (!ids || !ids.length) throw error(400, 'No ids provided for update');
    if (!changes || !changes.length) throw error(400, 'No changes provided for update');
    if (!patches || !patches.length) throw error(400, 'No patches provided for update');

    // change characters
    for (const { key, operation, value } of changes) {
      if (key !== 'characters') continue;
      const characterId = value as string;
      const character = await admin.records.getOne('characters', characterId);
      const portraits = getNewValue(operation, character.portraits, ids) as string[];
      await admin.records.update('characters', characterId, { portraits });
    }

    // change portraits
    const promises = patches.map(({ id, patchData }) =>
      admin.records.update('portraits', id, patchData, { expand: 'characters' })
    );
    const result = await Promise.all(promises);

    invalidateCache('portraits');
    invalidateCache('characters');
    log('editor', `Update ${pluralize('portrait', ids.length)} ${ids.join(', ')}`, changes);
    return json(result);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { ids } = (await request.json()) as { ids: string[] };
    if (!ids || !ids.length) throw error(400, 'No ids provided for deletion');

    const result = await Promise.all(ids.map((id) => admin.records.delete('portraits', id)));
    invalidateCache('portraits');
    invalidateCache('characters');
    log('portraits', `Delete ${pluralize('portrait', ids.length)} ${ids.join(', ')}`);
    return json(result);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};
