import { getPortraits } from '$lib/api';

const filter = 'active = true';
const sort = '+original';
const expand = 'original,tags,styles,colors';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: App.PageData) {
  const page = Number(params?.slug);
  const data = await getPortraits({ page, perPage: 20, filter, sort, expand });
  const portraits = JSON.parse(JSON.stringify(data));

  return { portraits, page };
}
