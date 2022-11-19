import admin from '$lib/api/admin';
import { BATCH_SIZE } from '$lib/config';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { IPortrait } from '$lib/types/api.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page')) || 1;
    const filter = url.searchParams.get('filter') || '';
    const expand = url.searchParams.get('expand') || '';
    const PAGE_SIZE = 50;

    const options = { filter, expand };
    const charactersList = await admin.records.getList('characters', page, PAGE_SIZE, options);
    log('characters', `Loading ${PAGE_SIZE} characters`);
    return new Response(JSON.stringify(charactersList));
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const character = await admin.records.create('characters', data);
    log('characters', `Create character`, data);
    await updatePortraits(character.portraits, character.id);
    return new Response(JSON.stringify(character));
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};

export const PATCH: RequestHandler = async ({ request, url }) => {
  try {
    const expand = url.searchParams.get('expand') || '';
    const data = await request.json();
    const character = await admin.records.update('characters', data.id, data, { expand });
    log('characters', `Update character ${data.id}`, data);
    await updatePortraits(character.portraits, character.id);
    return new Response(JSON.stringify(character));
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
};

async function updatePortraits(portraitIds: string[], characterId: string) {
  try {
    const filter = `characters~"${characterId}"`;
    const currentPortraits = await admin.records.getFullList('portraits', BATCH_SIZE, { filter });
    const portraitsToRemove = currentPortraits.filter(
      (portrait) => !portraitIds.includes(portrait.id)
    ) as unknown as IPortrait[];

    if (portraitsToRemove.length) {
      await Promise.all(
        portraitsToRemove.map((portrait) => {
          const characters = portrait.characters.filter((id) => id !== characterId);
          return admin.records.update('portraits', portrait.id, { characters });
        })
      );
      const removedIds = portraitsToRemove.map(({ id }) => id).join(', ');
      log('characters', `Remove character ${characterId} from portraits: ${removedIds}`);
    }

    const addedPortraits = (await Promise.all(
      portraitIds.map((id) => admin.records.getOne('portraits', id))
    )) as unknown as IPortrait[];
    const portraitsToAdd = addedPortraits.filter(
      (portrait) => !portrait.characters.includes(characterId)
    );

    if (portraitsToAdd.length) {
      await Promise.all(
        portraitsToAdd.map((portrait) => {
          const characters = [...(portrait.characters || []), characterId];
          return admin.records.update('portraits', portrait.id, { characters });
        })
      );
      const addedIds = portraitsToAdd.map(({ id }) => id).join(', ');
      log('characters', `Add character ${characterId} to portraits: ${addedIds}`);
    }
  } catch (err) {
    report('characters', err);
    throw createServerError(err);
  }
}
