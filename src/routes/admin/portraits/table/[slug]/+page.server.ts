import type { IList, IPortrait } from '$lib/types/api.types';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

const filter = 'active = true';
const sort = '+original';
const expand = 'original,tags,styles,colors';
const pageSize = '20';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const page = params.slug || '1';
  const searchParams = new URLSearchParams({ page, pageSize, filter, sort, expand });
  const portraits = await toJson<IList<IPortrait>>(fetch(`/api/portraits?${searchParams}`));

  return { portraits, page: Number(page) };
};
