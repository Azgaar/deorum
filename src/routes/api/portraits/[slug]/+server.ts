import { json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import admin from '$lib/api/admin';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug as string;
    const patchData = await request.json();

    const result = await admin.records.update('portraits', id, patchData);
    log('Portraits', 'Update portrait', patchData);
    return json(result);
  } catch (err) {
    report('Portraits', err);
    throw createServerError(err);
  }
};
