import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';

import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
import type {
  IBackground,
  IArchetype,
  IColor,
  IList,
  IOriginal,
  IPortrait,
  IRace,
  IStyle,
  ITag
} from '$lib/types/api.types';
import type { PageServerLoad } from './$types';

export const ssr = true;

const DEFAULT_FILTER = '';
const DEFAULT_SORT = '-created';

const pageSize = 100;
const page = 1;

// TODO: parse from search params
const filters: IPortraitFilters = {
  original: [],
  quality: [],
  colors: [],
  tags: [],
  styles: [],
  hasCharacters: null
};
const sorting: ISorting = { key: 'created', order: 'desc' };

export const load: PageServerLoad = async ({ url, fetch }) => {
  try {
    const searchParams = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      filter: url.searchParams.get('filter') || DEFAULT_FILTER,
      sort: url.searchParams.get('sort') || DEFAULT_SORT
    });

    const [portraitsList, originals, tags, styles, colors, races, archetypes, backgrounds] =
      await Promise.all([
        toJson<IList<IPortrait>>(fetch(`/api/portraits?${searchParams}`)),
        toJson<IOriginal[]>(fetch('/api/originals')),
        toJson<ITag[]>(fetch('/api/tags')),
        toJson<IStyle[]>(fetch('/api/styles')),
        toJson<IColor[]>(fetch('/api/colors')),
        toJson<IRace[]>(fetch('/api/races')),
        toJson<IArchetype[]>(fetch('/api/archetypes')),
        toJson<IBackground[]>(fetch('/api/backgrounds'))
      ]);

    const portraits = portraitsList.items;
    const hasMore = portraitsList.totalPages > 1;

    return {
      page,
      pageSize,
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
      pageSize,
      page,
      hasMore: false,
      filters,
      sorting,
      portraits: [],
      originals: [],
      tags: [],
      styles: [],
      colors: [],
      races: [],
      archetypes: [],
      backgrounds: []
    };
  }
};
