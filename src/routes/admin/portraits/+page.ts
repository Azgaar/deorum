import { getPortraits } from '$lib/api';
import { getFullList } from '$lib/api/getFullList';
import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';

import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
import type { IRace } from '$lib/types/api.types';

export const ssr = true;

const PAGE_SIZE = 100;
const DEFAULT_FILTER = 'active = true';
const DEFAULT_SORT = '-created';

// TODO: parse from search params
const filters: IPortraitFilters = { original: [], quality: [], colors: [], tags: [], styles: [] };
const sorting: ISorting = { key: 'created', order: 'desc' };

/** @type {import('./$types').PageLoad} */
export async function load({ url }: { url: URL }) {
  try {
    const page = 1;
    const filter = url.searchParams.get('filter') || DEFAULT_FILTER;
    const sort = url.searchParams.get('sort') || DEFAULT_SORT;

    const [
      portraitsList,
      originalsData,
      tagsData,
      stylesData,
      colorsData,
      racesData,
      archetypesData,
      backgroundsData
    ] = await Promise.all([
      getPortraits({ page, perPage: PAGE_SIZE, filter, sort }),
      getFullList('originals'),
      getFullList('tags'),
      getFullList('styles'),
      getFullList('colors'),
      getFullList('races'),
      getFullList('archetypes'),
      getFullList('backgrounds')
    ]);

    const portraits = portraitsList.items;
    const hasMore = portraitsList.totalPages > 1;

    const originals = new Map(originalsData.map(({ id, image, name }) => [id, { image, name }]));
    const tags = new Map(tagsData.map(({ id, image, name }) => [id, { image, name }]));
    const styles = new Map(stylesData.map(({ id, image, name }) => [id, { image, name }]));
    const colors = new Map(colorsData.map(({ image, name }) => [name, { image, name }]));
    const races = new Map(racesData.map((race) => [race.id, race]));
    const archetypes = new Map(archetypesData.map(({ id, name }) => [id, { name }]));
    const backgrounds = new Map(backgroundsData.map(({ id, name }) => [id, { name }]));

    return {
      page,
      hasMore,
      filters,
      sorting,
      portraits,
      originals,
      tags,
      styles,
      colors,
      races,
      archetypes,
      backgrounds
    };
  } catch (error) {
    report('admin', error, url);
    toastError(error);

    return {
      page: 1,
      hasMore: false,
      filters,
      sorting,
      portraits: [],
      originals: new Map() as Map<string, { image: string; name: string }>,
      tags: new Map() as Map<string, { image: string; name: string }>,
      styles: new Map() as Map<string, { image: string; name: string }>,
      colors: new Map() as Map<string, { image: string; name: string }>,
      races: new Map() as Map<string, IRace>,
      archetypes: new Map() as Map<string, { name: string }>,
      backgrounds: new Map() as Map<string, { name: string }>
    };
  }
}
