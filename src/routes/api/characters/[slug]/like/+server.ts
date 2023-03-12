import { json } from '@sveltejs/kit';

import admin from '$lib/api/admin';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { updateCache } from '$lib/cache/cacheInstance';
import { authorize } from '$lib/api/auth';

import type { RequestHandler } from '../$types';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug;

    const { client, user } = await authorize(request);
    if (!user) throw createServerError('Unauthorized');

    const oldLiked = user.profile.liked.filter((characterId) => characterId !== id);
    const liked = [...oldLiked, id];
    await client.records.update('profiles', user.profile.id, { liked });

    const oldCharacter = await admin.records.getOne('characters', id);
    const likes = oldCharacter.likes + 1;
    await admin.records.update('characters', id, { likes });
    updateCache('characters', id, { likes });

    log('characters', `Like character ${id}`);
    return json({ id });
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug;

    const { client, user } = await authorize(request);
    if (!user) throw createServerError('Unauthorized');

    const liked = user.profile.liked.filter((characterId) => characterId !== id);
    await client.records.update('profiles', user.profile.id, { liked });

    const oldCharacter = await admin.records.getOne('characters', id);
    const likes = Math.max(oldCharacter.likes - 1, 0);
    await admin.records.update('characters', id, { likes });
    updateCache('characters', id, { likes });

    log('characters', `Unlike character ${id}`);
    return json({ id });
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};
