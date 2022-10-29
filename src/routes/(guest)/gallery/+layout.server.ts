import { error, redirect } from '@sveltejs/kit';

import { getRandomIndex, sliceElements } from '$lib/utils/array';
import { getCachedList } from '$lib/cache/cacheInstance';
import { getRandomName } from '$lib/utils/random';

import type { IPortrait } from '$lib/types/api.types';
import type { IGalleryItem } from '$lib/types/gallery.types';

export const filter = "(active=true)&&(quality>6)&&(styles.id~'nkiyl5tr2chv23m')"; // style contains 'drawing'
export const sort = '-quality,id';

const SELECT_BEFORE = 10;
const SELECT_AFTER = 15;

export const load: import('./$types').LayoutServerLoad = async ({ params }) => {
  const portraits = await getCachedList<IPortrait>('portraits', filter, sort);
  if (!portraits || !portraits.length) throw error(503, 'No portraits returned');

  const currentIndex = Boolean(params.slug) && portraits.findIndex(({ id }) => id === params.slug);
  if (currentIndex === false || currentIndex === -1) {
    const randomId = portraits[getRandomIndex(portraits.length)].id;
    throw redirect(307, `/gallery/${randomId}`);
  }

  const current = portraits[currentIndex];
  const before = sliceElements(portraits, currentIndex - SELECT_BEFORE, currentIndex);
  const after = sliceElements(portraits, currentIndex + 1, currentIndex + SELECT_AFTER + 1);

  const selection = [...before, current, ...after];
  const items: IGalleryItem[] = selection.map(({ id, image }) => ({
    id,
    image,
    name: getRandomName()
  }));

  console.info(`Loading gallery for portrait ${params.slug}, ${currentIndex}/${portraits.length}`);

  return { items, currentId: current.id };
};
