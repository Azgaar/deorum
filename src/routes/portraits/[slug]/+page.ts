import PocketBase from 'pocketbase';

import { URL } from '../../../config';

export const prerender = true;
export const PAGE_SIZE = 2;

const colors = new Map([
  ['red', '🔴 red'],
  ['orange', '🟠 orange'],
  ['yellow', '🟡 yellow'],
  ['green', '🟢 green'],
  ['blue', '🔵 blue'],
  ['lightblue', '🔵 light blue'],
  ['purple', '🟣 purple'],
  ['pink', '🟤 pink'],
  ['brown', '🟤 brown'],
  ['black', '⚫️ black'],
  ['white', '⚪️ white'],
  ['grey', '⚪️ grey']
]);

/** @type {import('./$types').PageLoad} */
export async function load({ params }: App.PageData) {
  const client = new PocketBase(URL);
  const page = Number(params?.slug);
  const filter = 'active = true';

  const portraitsRequest = client.records.getList('portraits', page, PAGE_SIZE, { filter });
  const tagsRequest = client.records.getFullList('tags', 1000);
  const stylesRequest = client.records.getFullList('styles', 1000);
  const originalsRequest = client.records.getFullList('originals', 1000);

  const [portraits, tagsData, stylesData] = await Promise.all([
    portraitsRequest,
    tagsRequest,
    stylesRequest
  ]);

  const tags = new Map(tagsData.map((tag) => [tag.id, `${tag.emoji} ${tag.name}`]));
  const styles = new Map(stylesData.map((style) => [style.id, `${style.emoji} ${style.name}`]));
  const originals = new Map(
    (await originalsRequest).map((original) => [original.id, original.name])
  );

  return { portraits, tags, styles, colors, originals, page };
}
