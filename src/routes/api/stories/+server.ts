import { error } from '@sveltejs/kit';
import { StreamingTextResponse, streamText } from 'ai';

import { getModel } from '$lib/api/ai';
import { authorize } from '$lib/api/auth';
import { SYSTEM_PROMPT, models, type Model } from '$lib/config/story';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import type { RequestHandler } from './$types';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt, model } = (await request.json()) as { prompt: string; model: Model };
    if (!prompt) throw new Error('No prompt provided');

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    const price = models[model].price;

    if (!coinsLeft || coinsLeft < price) throw error(403, 'Not enought coins');

    const result = await streamText({
      model: getModel(model),
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 1
    });
    await client.records.update('profiles', user.profile.id, { coins: coinsLeft - price });

    log('story', 'Generating story', { model, prompt });
    return new StreamingTextResponse(result.textStream);
  } catch (err) {
    report('story', err);
    throw createServerError(err);
  }
};
