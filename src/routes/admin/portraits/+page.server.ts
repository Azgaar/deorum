import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import { getCachedList } from '$lib/cache/cacheInstance';

import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
import type {
  IBackground,
  IArchetype,
  IColor,
  IListResult,
  IOriginal,
  IPortrait,
  IRace,
  IStyle,
  ITag
} from '$lib/types/api.types';
import type { PageServerLoad } from './$types';

export const ssr = true;

const DEFAULT_FILTER = 'active=true';
const DEFAULT_SORT = '-created';

const pageSize = 100;
const page = 1;

// TODO: parse from search params
const filters: IPortraitFilters = { original: [], quality: [], colors: [], tags: [], styles: [] };
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
        toJson<IListResult<IPortrait>>(fetch(`/api/portraits?${searchParams}`)),
        getCachedList<IOriginal>('originals'),
        getCachedList<ITag>('tags'),
        getCachedList<IStyle>('styles'),
        getCachedList<IColor>('colors'),
        getCachedList<IRace>('races'),
        getCachedList<IArchetype>('archetypes'),
        getCachedList<IBackground>('backgrounds')
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
