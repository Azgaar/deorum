import { json, type RequestHandler } from '@sveltejs/kit';

import { log, report } from '$lib/utils/log';
import { createServerError } from '$lib/utils/errors';
import admin from '$lib/api/admin';

export const POST: RequestHandler = async (event) => {
  try {
    const formData = await event.request.formData();
    const result = await admin.records.create('portraits', formData, { $autoCancel: false });
    log('Portraits', 'Upload portrait', formData);
    return json(result);
  } catch (err) {
    report('Portraits', err);
    throw createServerError(err);
  }
};
