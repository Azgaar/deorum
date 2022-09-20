import PocketBase from 'pocketbase';

import { URL } from '$lib/config';

export const PAGE_SIZE = 20;

/** @type {import('./$types').PageLoad} */
export async function load({ params }: App.PageData) {
  const client = new PocketBase(URL);
  const page = Number(params?.slug);
  const filter = 'active = true';
  const sort = '+original';

  const portraitsRequest = client.records.getList('portraits', page, PAGE_SIZE, { filter, sort });
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
    originalsData.map((original) => [original.id, original.name as string])
  );

  return { portraits, tags, styles, originals, page };
}
