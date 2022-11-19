import { json } from '@sveltejs/kit';

import { authorize } from '$lib/api/auth';
import { requestStory } from '$lib/api/openAI';
import { Role } from '$lib/stores';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    if (!prompt) throw new Error('No prompt provided');

    const cookie = request.headers.get('cookie');
    if (!cookie) throw new Error('Unauthorized, no cookie provided');

    const user = await authorize(cookie);
    const role = user?.profile?.role;
    if (role !== Role.ADMIN) throw new Error('Unauthorized, admin access required');

    const response = await requestStory(prompt);
    const story = response.data.choices[0].text || '';
    const tokens = response.data.usage?.total_tokens;

    log('story', `Generated story for ${tokens} tokens for prompt:\n${prompt}\n=>\n${story}`);
    return json({ story });
  } catch (err) {
    report('story', err);
    return createServerError(err);
  }
};
