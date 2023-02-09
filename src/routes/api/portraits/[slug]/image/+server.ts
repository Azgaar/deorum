import { json, type RequestHandler } from '@sveltejs/kit';

import admin from '$lib/api/admin';
import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import { invalidateCache } from '$lib/cache/cacheInstance';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug as string;
    const formData = await request.formData();
    const result = await admin.records.update('portraits', id, formData);
    invalidateCache('portraits');
    log('portraits', 'Update portrait', formData);
    return json(result);
  } catch (err) {
    report('Portraits', err);
    throw createServerError(err);
  }
};
