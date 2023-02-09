import { error, json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedList, getCachedPage, invalidateCache } from '$lib/cache/cacheInstance';
import { pluralize } from '$lib/utils/string';
import { getNewValue } from '$lib/utils/portraits';
import admin from '$lib/api/admin';

import type { IPortrait } from '$lib/types/api.types';
import type { IChange } from '$lib/types/editor.types';

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
      const portraitsPage = await getCachedPage<IPortrait>('portraits', ...args);
      log('portraits', `Loading ${pageSize} portraits`);
      return new Response(JSON.stringify(portraitsPage));
    }

    const portraits = await getCachedList<IPortrait>('portraits', filter, sort, expand);
    log('portraits', `Loading all portraits`);
    return new Response(JSON.stringify(portraits));
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const result = await admin.records.create('portraits', formData, { $autoCancel: false });
    invalidateCache('portraits');
    log('portraits', 'Upload portrait', formData);
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
    log('portraits', `Delete ${pluralize('portrait', ids.length)} ${ids.join(', ')}`);
    return json(result);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};
