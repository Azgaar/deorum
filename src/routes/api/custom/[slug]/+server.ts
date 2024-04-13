import admin from '$lib/api/admin';
import { getElement } from '$lib/api/getData';
import { invalidateCache } from '$lib/cache/cacheInstance';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const id = params.slug as string;
    const expand = url.searchParams.get('expand') || '';

    const character = await getElement('custom', id, expand);
    log('custom', `Loading custom character ${id} (${character.name}) by ${character.creator}`);
    return json(character);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug as string;
    const data = await request.json();
    const character = await admin.records.update('custom', id, data);
    invalidateCache('custom');
    log(
      'custom',
      `Update custom character ${id} (${character.name}) by ${character.creator}`,
      data
    );

    return json(character);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = params.slug as string;
    const character = await admin.records.delete('custom', id);
    invalidateCache('custom');

    log('custom', `Delete custom character ${id}`);
    return json(character);
  } catch (err) {
    report('custom', err);
    throw createServerError(err);
  }
};
