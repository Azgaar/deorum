import { error } from '@sveltejs/kit';

import { Role } from '$lib/config';
import { authorize } from '$lib/api/auth';
import { openAIStream } from '$lib/api/openAI';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { RequestHandler } from './$types';

export const config: import('@sveltejs/adapter-vercel').Config = {
  runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    if (!prompt) throw new Error('No prompt provided');

    const { user } = await authorize(request);
    if (!user) throw error(401, 'Unauthorized');

    const role = user?.profile?.role;
    if (role !== Role.ADMIN) throw error(401, 'Unauthorized, admin access required');

    const stream = await openAIStream(prompt);
    log('story', 'Generating story', { prompt });
    return new Response(stream);
  } catch (err) {
    report('story', err);
    throw createServerError(err);
  }
};
