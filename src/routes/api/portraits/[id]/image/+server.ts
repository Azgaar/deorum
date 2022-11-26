import { json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import admin from '$lib/api/admin';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.id as string;
    const formData = await request.formData();
    const result = await admin.records.update('portraits', id, formData);
    log('Portraits', 'Update portrait', formData);
    return json(result);
  } catch (err) {
    report('Portraits', err);
    throw createServerError(err);
  }
};
