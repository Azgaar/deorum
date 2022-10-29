import { MATCH_NAMES_NUMBER } from '$lib/config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
  const { current, next } = await parent();

  const res = await fetch(`/api/names/random?quantity=${MATCH_NAMES_NUMBER}`);
  const names = await res.json();

  return { current, next, names };
};
