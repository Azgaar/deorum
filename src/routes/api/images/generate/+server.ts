import * as fal from '@fal-ai/serverless-client';
import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';
import { authorize } from '$lib/api/auth';
import { IMAGE_GENERATION_PRICE } from '$lib/config/image';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

fal.config({ credentials: env.FAL_KEY || '' });

type Input = {
  prompt: string;
  image_size: string;
  num_inference_steps: number;
  guidance_scale: number;
  enable_safety_checker: boolean;
};

type Output = {
  images: [{ url: string; content_type: string }];
  prompt: string;
};

enum Models {
  FLUX_PRO = 'fal-ai/flux-pro',
  FLUX_GENERAL = 'fal-ai/flux-general',
  FLUX_DEV = 'fal-ai/flux/dev',
  FLUX_SCHNELL = 'fal-ai/flux/schnell',
  SDXL_LIGHTNING = 'fal-ai/fast-lightning-sdxl',
  AURA_FLOW = 'fal-ai/aura-flow',
  FLUX_SCHNELL_IMG_2_IMG = 'fal-ai/flux/dev/image-to-image'
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = (await request.json()) as { prompt: string };
    if (!prompt) throw new Error('No prompt provided');

    const { client, user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const coinsLeft = user.profile.coins;
    if (!coinsLeft || coinsLeft < IMAGE_GENERATION_PRICE) throw error(403, 'Not enought coins');

    const result = await fal.subscribe<Input, Output>(Models.FLUX_SCHNELL, {
      input: {
        prompt,
        image_size: 'square_hd',
        num_inference_steps: 5,
        guidance_scale: 8,
        enable_safety_checker: false
      },
      logs: true
    });

    const { url } = result.images[0];
    if (!url) throw error(500, 'Failed to generate image');

    await client.records.update('profiles', user.profile.id, {
      coins: coinsLeft - IMAGE_GENERATION_PRICE
    });

    log('image', 'Generating image', { prompt, url });

    return json({ url });
  } catch (err) {
    report('image', err);
    throw createServerError(err);
  }
};
