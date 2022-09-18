import PocketBase from 'pocketbase';

import { URL } from '../../config';

export const prerender = true;
export const csr = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const client = new PocketBase(URL);

  const page = Number(params.slug);
  const portraits = await client.records.getList('portraits', page, 2, {
    filter: 'active = true'
  });

  return { portraits, page };
}
