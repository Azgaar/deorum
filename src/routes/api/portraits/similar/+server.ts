import { getCachedList } from '$lib/cache/cacheInstance';
import type { IPortrait } from '$lib/types/api.types';
import type { TSimilarityCriteria } from '$lib/types/portraits.types';
import { createServerError } from '$lib/utils/errors';
import { log, report } from '$lib/utils/log';
import { json, type RequestHandler } from '@sveltejs/kit';

const SIZE = 50;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const allPortraits = await getCachedList<IPortrait>(
      'portraits',
      ['quality > 4'],
      '',
      'characters'
    );

    const data = (await request.json()) as TSimilarityCriteria;
    const similarPortraits = scorePortraits(allPortraits, data, SIZE);
    log('similar portraits', `Searching ${SIZE} similar portraits`);
    return json(similarPortraits);
  } catch (err) {
    report('similar portraits', err);
    throw createServerError(err);
  }
};

function scorePortraits(
  allPortraits: IPortrait[],
  { original, gender, race, archetype, background }: TSimilarityCriteria,
  size: number
) {
  const scored: [number, IPortrait][] = allPortraits.map((portrait) => {
    let score = portrait.quality + Math.floor(Math.random() * 5); // quality + random factor 0-5
    if (original && portrait.original === original) score += 10;

    const character = portrait['@expand'].characters?.[0];
    if (character) {
      if (gender && gender !== 'non-binary' && gender === character.gender) score += 20;
      if (race && race === character.race) score += 20;
      if (archetype && archetype === character.archetype) score += 5;
      if (background && background === character.background) score += 5;
    }

    return [score, portrait];
  });

  return scored
    .sort((a, b) => b[0] - a[0])
    .slice(0, size)
    .map(([, portrait]) => portrait);
}
