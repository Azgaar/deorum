import { error, json } from '@sveltejs/kit';

import { Role } from '$lib/config';
import { authorize } from '$lib/api/auth';
import { requestStory } from '$lib/api/openAI';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    if (!prompt) throw new Error('No prompt provided');

    const cookie = request.headers.get('cookie');
    if (!cookie) throw error(401, 'Unauthorized, no cookie provided');

    const user = await authorize(cookie);
    const role = user?.profile?.role;
    if (role !== Role.ADMIN) throw error(401, 'Unauthorized, admin access required');

    const response = await requestStory(prompt);
    const story = response.data.choices[0].text || '';
    const tokens = response.data.usage?.total_tokens;

    log('story', `Generated story for ${tokens} tokens`);
    return json({ story: story.trim() });
  } catch (err) {
    report('story', err);
    throw createServerError(err);
  }
};
