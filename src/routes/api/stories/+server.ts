import { error } from '@sveltejs/kit';

import { authorize } from '$lib/api/auth';
import { openAIStream } from '$lib/api/openAI';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { RequestHandler } from './$types';
import { GENERATE_BIO_PRICE } from '$lib/config/coins';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt, model } = await request.json();
    if (!prompt) throw new Error('No prompt provided');

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    if (!coinsLeft || coinsLeft < GENERATE_BIO_PRICE) throw error(403, 'Not enought coins');

    const stream = await openAIStream(prompt, model);

    const coins = coinsLeft - GENERATE_BIO_PRICE;
    await client.records.update('profiles', user.profile.id, { coins });

    log('story', 'Generating story', { model, prompt });
    return new Response(stream);
  } catch (err) {
    report('story', err);
    throw createServerError(err);
  }
};
