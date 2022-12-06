import { getPortraits } from '$lib/api';
import { makePOJO } from '$lib/utils/object';

const filter = 'active = true';
const sort = '+original';
const expand = 'original,tags,styles,colors';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: App.PageData) {
  const page = Number(params?.slug);
  const data = await getPortraits({ page, perPage: 20, filter, sort, expand });
  const portraits = makePOJO(data);

  return { portraits, page };
}
