import { error } from '@sveltejs/kit';
import { StreamingTextResponse, streamText } from 'ai';

import { getStoryModel } from '$lib/api/ai';
import { authorize } from '$lib/api/auth';
import { Role } from '$lib/config';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import type { RequestHandler } from './$types';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

const MODEL = 'gpt-4o';
const PROMPT =
  'Create precise and very detailed comma-separated list describing fantasy character portrait you see. Focus on appearance, ethnicity, overall scene, and personality. Ignore background. Catch as many details as possible.';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url } = (await request.json()) as { url: string };
    if (!url) throw new Error('No image url provided');

    const { user } = await authorize(request);
    if (!user || user.profile.role !== Role.ADMIN) throw error(401, 'Unauthorized');

    const result = await streamText({
      model: getStoryModel(MODEL),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: new URL(url) },
            { type: 'text', text: PROMPT }
          ]
        }
      ],
      temperature: 1,
      maxTokens: 256
    });

    log('describe', 'Generating image description', { image: url });
    return new StreamingTextResponse(result.toAIStream());
  } catch (err) {
    report('describe', err);
    throw createServerError(err);
  }
};
