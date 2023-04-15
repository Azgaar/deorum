import { json } from '@sveltejs/kit';
import admin from '$lib/api/admin';
import { invalidateCache } from '$lib/cache/cacheInstance';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { RequestHandler } from '../../characters/[slug]/$types';

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = params.slug;
    const character = await admin.records.delete('custom', id);
    invalidateCache('custom');

    log('custom', `Custom character ${id} is deleted`);
    return json(character);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};
