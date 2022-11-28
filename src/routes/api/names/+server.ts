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
    if (!namesData[race]) throw new Error(`Names generator for ${race} race is not defined`);

    const genderValue = defineGender(gender);
    const generator = namesData[race]?.[genderValue];
    if (!generator) throw new Error(`Names generator for ${race} ${genderValue} is not defined`);

    const properName = generator();
    const { clan = () => null, clanChance = 0 } = namesData[race];
    const clanName = Math.random() < clanChance ? clan() : null;
    const name = clanName ? `${properName} ${clanName}` : properName;

    log('names', `Generating ${race} ${genderValue} name: ${name}`);
    return new Response(JSON.stringify(name));
  } catch (err) {
    report('names', err);
    throw createServerError(err);
  }
};
