import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';

import { OPENAI_API_KEY } from '$env/static/private';
import { authorize } from '$lib/api/auth';
import { DEFAULT_IMAGE_MODEL, IMAGE_GENERATION_PRICE } from '$lib/config/image';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = (await request.json()) as { prompt: string };
    if (!prompt) throw new Error('No prompt provided');

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    if (!coinsLeft || coinsLeft < IMAGE_GENERATION_PRICE) throw error(403, 'Not enought coins');

    const result = await openai.images.generate({
      model: DEFAULT_IMAGE_MODEL,
      prompt,
      size: '1024x1024'
    });
    const { url } = result.data[0];
    if (!url) throw error(500, 'Failed to generate image');

    await client.records.update('profiles', user.profile.id, {
      coins: coinsLeft - IMAGE_GENERATION_PRICE
    });

    log('image', 'Generating image', { prompt, url });

    return json(url);
  } catch (err) {
    report('image', err);
    throw createServerError(err);
  }
};
