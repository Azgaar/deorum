import admin from '$lib/api/admin';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug;
    const data = await request.json(); // category, message, userId
    await admin.records.create('reports', { character: id, status: 'new', ...data });

    log('characters', `Report issue for ${id}`);
    return json({ id });
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};
