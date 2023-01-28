import { json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import admin from '$lib/api/admin';

import { getCachedList, getCachedPage } from '$lib/cache/cacheInstance';
import type { IPortrait } from '$lib/types/api.types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page'));
    const pageSize = Number(url.searchParams.get('pageSize'));

    const filter = url.searchParams.get('filter') || '';
    const sort = url.searchParams.get('sort') || '';
    const expand = url.searchParams.get('expand') || '';

    if (page && pageSize) {
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

export const POST: RequestHandler = async (event) => {
  try {
    const formData = await event.request.formData();
    const result = await admin.records.create('portraits', formData, { $autoCancel: false });
    log('portraits', 'Upload portrait', formData);
    return json(result);
  } catch (err) {
    report('Portraits', err);
    throw createServerError(err);
  }
};
