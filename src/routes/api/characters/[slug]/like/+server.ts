import { error, json } from '@sveltejs/kit';

import admin from '$lib/api/admin';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { updateCache } from '$lib/cache/cacheInstance';
import { authorize } from '$lib/api/auth';

import type { RequestHandler } from '../$types';
import type { ICharacter } from '$lib/types/api.types';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.slug;

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const oldLiked = user.profile.liked.filter((characterId) => characterId !== id);
    const liked = [...oldLiked, id];
    await client.records.update('profiles', user.profile.id, { liked });

    const oldCharacter = (await admin.records.getOne('characters', id)) as unknown as ICharacter;
    if (!oldCharacter.likes) throw createServerError(`Custom character ${id} cannot be liked`);

    const oldLikes = oldCharacter.likes.filter((userId) => userId !== user.id);
    const likes = [...oldLikes, user.id];
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
    if (!user) throw error(401, 'Unauthorized');

    const liked = user.profile.liked.filter((characterId) => characterId !== id);
    await client.records.update('profiles', user.profile.id, { liked });

    const oldCharacter = (await admin.records.getOne('characters', id)) as unknown as ICharacter;
    if (!oldCharacter.likes) throw createServerError(`Custom character ${id} cannot be unliked`);

    const likes = oldCharacter.likes.filter((userId) => userId !== user.id);
    await admin.records.update('characters', id, { likes });
    updateCache('characters', id, { likes });

    log('characters', `Unlike character ${id}`);
    return json({ id });
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};
