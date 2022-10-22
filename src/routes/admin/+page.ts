import { getPortraits } from '$lib/api';
import { getFullList } from '$lib/api/getFullList';
import type { IFilters, ISorting } from '$lib/types/filters.types';
import { toastError } from '$lib/stores';
import { normalizeError } from '$lib/utils/errors';

export const ssr = true;

const PAGE_SIZE = 100;
const DEFAULT_FILTER = 'active = true';
const DEFAULT_SORT = '-created';

// TODO: parse from search params
const filters: IFilters = {
  original: [],
  quality: [],
  colors: [],
  tags: [],
  styles: []
};

// TODO: parse from search params
const sorting: ISorting = { key: 'created', order: 'desc' };

/** @type {import('./$types').PageLoad} */
export async function load({ url }: { url: URL }) {
  try {
    const page = 1;
    const filter = url.searchParams.get('filter') || DEFAULT_FILTER;
    const sort = url.searchParams.get('sort') || DEFAULT_SORT;

    const [portraitsList, tagsData, stylesData, originalsData, colorsData] = await Promise.all([
      getPortraits({ page, perPage: PAGE_SIZE, filter, sort }),
      getFullList('tags'),
      getFullList('styles'),
      getFullList('originals'),
      getFullList('colors')
    ]);

    const portraits = portraitsList.items;
    const hasMore = portraitsList.totalPages > 1;

    const tags = new Map(tagsData.map(({ id, image, name }) => [id, { image, name }]));

    const styles = new Map(stylesData.map(({ id, image, name }) => [id, { image, name }]));

    const colors = new Map(colorsData.map(({ image, name }) => [name, { image, name }]));

    const originals = new Map(
      originalsData.map((original) => {
        const { id, image, name } = original;
        return [id, { image, name }];
      }) as [string, { image: string; name: string }][]
    );

    return {
      page,
      hasMore,
      filters,
      sorting,
      portraits,
      tags,
      styles,
      colors,
      originals
    };
  } catch (error) {
    console.error(error);
    toastError(normalizeError(error));

    return {
      page: 1,
      hasMore: false,
      filters,
      sorting,
      portraits: [],
      tags: new Map(),
      styles: new Map(),
      colors: new Map(),
      originals: new Map()
    };
  }
}
