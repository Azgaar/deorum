import type { RequestHandler } from '@sveltejs/kit';

import { namesData } from '$lib/data/names';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';

const defineGender = (value: string): 'male' | 'female' => {
  if (value === 'male') return 'male';
  if (value === 'female') return 'female';
  return Math.random() < 0.5 ? 'male' : 'female';
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { race, gender } = await request.json();
    if (!race) throw new Error('Race is not provided');

    const genderValue = defineGender(gender);
    const data = namesData[race]?.[genderValue];
    if (!data) throw new Error('Name generator data is not defined');

    const name = data.method(data.names);
    log('names', `Generating ${race} ${genderValue} name: ${name}`);
    return new Response(JSON.stringify(name));
  } catch (err) {
    report('names', err);
    throw createServerError(err);
  }
};
