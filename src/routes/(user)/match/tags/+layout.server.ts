import { error, redirect } from '@sveltejs/kit';

import { MATCH_TAGS_NUMBER } from '$lib/config';
import { getRandomElements, getRandomIndex, shuffle } from '$lib/utils/array';
import { toJson } from '$lib/utils/requests';
import { log } from '$lib/utils/log';

import type { IPortrait, ITag } from '$lib/types/api.types';

const selectRandomTags = (currentTags: string[], allTags: ITag[]): ITag[] => {
  const randomExistingTags = getRandomElements(currentTags, Math.min(2, currentTags.length));

  const existingTags: ITag[] = [];
  const otherTags: ITag[] = [];

  allTags.forEach((tag) => {
    if (randomExistingTags.includes(tag.id)) existingTags.push(tag);
    else otherTags.push(tag);
  });

  const randomTags = getRandomElements(otherTags, MATCH_TAGS_NUMBER - existingTags.length);
  return shuffle([...existingTags, ...randomTags]);
};

export const load: import('./$types').LayoutServerLoad = async ({ params, fetch }) => {
  const [portraits, tags] = await Promise.all([
    toJson<IPortrait[]>(fetch('/api/portraits?filter=active=true&&quality>6')),
    toJson<ITag[]>(fetch('/api/tags'))
  ]);

  if (!portraits || !portraits.length) throw error(503, 'No portraits returned');
  if (!tags || !tags.length) throw error(503, 'No tags returned');

  const currentIndex = Boolean(params.slug) && portraits.findIndex(({ id }) => id === params.slug);
  if (currentIndex === false || currentIndex === -1) {
    const randomId = portraits[getRandomIndex(portraits.length)].id;
    throw redirect(307, `/match/tags/${randomId}`);
  }

  const current = portraits[currentIndex];
  const next = portraits[getRandomIndex(portraits.length)];
  const randomTags = selectRandomTags(current.tags, tags);

  const tagsString = randomTags.map(({ name }) => name).join(', ');
  log('match', `Matching portrait ${current.id} with tags ${tagsString}`);

  return { current, next, tags: randomTags };
};
