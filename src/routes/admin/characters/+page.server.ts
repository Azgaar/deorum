import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';

import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
import type {
  IArchetype,
  IBackground,
  ICharacter,
  IListResult,
  IRace,
  ITag
} from '$lib/types/api.types';
import type { PageServerLoad } from './$types';

export const ssr = true;

const EXPAND = 'race,archetype,background,portraits';
const DEFAULT_FILTER = '';
const DEFAULT_SORT = '-created';

const pageSize = 100;
const page = 1;

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
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      filter: url.searchParams.get('filter') || DEFAULT_FILTER,
      sort: url.searchParams.get('sort') || DEFAULT_SORT,
      expand: EXPAND
    });

    const [charactersList, tags, races, archetypes, backgrounds] = await Promise.all([
      toJson<IListResult<ICharacter>>(fetch(`/api/characters?${params}`)),
      toJson<ITag[]>(fetch('/api/tags')),
      toJson<IRace[]>(fetch('/api/races')),
      toJson<IArchetype[]>(fetch('/api/archetypes')),
      toJson<IBackground[]>(fetch('/api/backgrounds'))
    ]);

    const characters = charactersList.items;
    const hasMore = charactersList.totalPages > 1;

    return {
      page,
      pageSize,
      hasMore,
      filters,
      sorting,
      characters,
      races,
      archetypes,
      backgrounds,
      tags
    };
  } catch (error) {
    report('admin', error, url);
    toastError(error);

    return {
      page,
      pageSize,
      hasMore: false,
      filters,
      sorting,
      characters: [],
      races: [],
      archetypes: [],
      backgrounds: [],
      tags: []
    };
  }
};
