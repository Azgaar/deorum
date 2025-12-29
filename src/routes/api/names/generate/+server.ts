import { error, json } from '@sveltejs/kit';
import { generateText } from 'ai';

import { getStoryModel } from '$lib/api/ai';
import { authorize } from '$lib/api/auth';
import { models, type StoryModel } from '$lib/config/story';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import type { RequestHandler } from './$types';

export const config: import('@sveltejs/adapter-vercel').Config = {
  maxDuration: 60,
  runtime: 'nodejs20.x'
};

const SYSTEM_PROMPT =
  'You are a fantasy name generator. Generate a single, appropriate fantasy character name. Return only the name, nothing else.';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { race, gender, archetype, background, model } = (await request.json()) as {
      race: string;
      gender: string;
      archetype: string;
      background: string;
      model: StoryModel;
    };

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    const price = models[model].price;

    if (!coinsLeft || coinsLeft < price) throw error(403, 'Not enought coins');

    const parts = [race, gender, archetype, background].filter(Boolean);

    const result = await generateText({
      model: getStoryModel(model),
      system: SYSTEM_PROMPT,
      prompt: parts.join(' ') || '',
      temperature: 1
    });

    await client.records.update('profiles', user.profile.id, { coins: coinsLeft - price });

    const name = result.text.trim();
    log('name', 'Generating name', { model, race, gender, name });
    return json({ name });
  } catch (err) {
    report('name generator', err);
    throw createServerError(err);
  }
};
