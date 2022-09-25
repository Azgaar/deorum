import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

export const BATCH_SIZE = 200;

/** @type {import('./$types').PageLoad} */
export async function load() {
  const client = new PocketBase(URL);
  const filter = 'active = true';
  const sort = '+original';

  const portraitsRequest = client.records.getFullList('portraits', BATCH_SIZE, { filter, sort });
  const tagsRequest = client.records.getFullList('tags', 1000);
  const stylesRequest = client.records.getFullList('styles', 1000);
  const originalsRequest = client.records.getFullList('originals', 1000);

  const [portraits, tagsData, stylesData, originalsData] = await Promise.all([
    portraitsRequest,
    tagsRequest,
    stylesRequest,
    originalsRequest
  ]);

  const tags = new Map(tagsData.map((tag) => [tag.id, `${tag.emoji} ${tag.name}`]));

  const styles = new Map(stylesData.map((style) => [style.id, `${style.emoji} ${style.name}`]));

  const originals = new Map(
    originalsData.map((original) => {
      const { id, image, name } = original;
      return [id, { image, name }];
    }) as [string, { image: string; name: string }][]
  );

  const portraitsImagePath = `${URL}/api/files/${portraits[0]?.['@collectionId']}`;
  const originalsImagePath = `${URL}/api/files/${originalsData[0]?.['@collectionId']}`;

  return { portraits, tags, styles, originals, portraitsImagePath, originalsImagePath };
}
