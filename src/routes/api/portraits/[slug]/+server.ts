import { json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { getCachedElement, invalidateCache } from '$lib/cache/cacheInstance';
import admin from '$lib/api/admin';

import type { IPortrait } from '$lib/types/api.types';

export const GET: RequestHandler = async ({ url, params }) => {
  try {
    const id = params.slug as string;
    const expand = url.searchParams.get('expand') || '';

    const portrait = await getCachedElement<IPortrait>('portraits', id, expand);
    log('portraits', `Loading portrait ${id}`);
    return json(portrait);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug as string;
    const patchData = await request.json();

    const result = await admin.records.update('portraits', id, patchData);
    invalidateCache('portraits');
    log('portraits', 'Update portrait', patchData);
    return json(result);
  } catch (err) {
    report('portraits', err);
    throw createServerError(err);
  }
};