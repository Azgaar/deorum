import { MATCH_NAMES_NUMBER } from '$lib/config';
import type { IPortrait } from '$lib/types/api.types';
import { getGenderFromTags, getRaceFromTags } from '$lib/utils/tags';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
  const { current, next } = await parent();

  const type = getGenderFromTags(current as IPortrait);
  const race = getRaceFromTags(current as IPortrait);
  const res = await fetch(
    `/api/names/ironarachne?quantity=${MATCH_NAMES_NUMBER}&race=${race}&type=${type}`
  );
  const names = await res.json();

  return { current, next, names, type, race };
};
