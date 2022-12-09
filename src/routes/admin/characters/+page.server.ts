import { getFullList } from '$lib/api/getFullList';
import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';
import { makePOJO } from '$lib/utils/object';

import type { IFilters, ISorting } from '$lib/types/filters.types';
import type { ICharacter, IListResult } from '$lib/types/api.types';
import type { PageServerLoad } from './$types';

export const ssr = true;

const EXPAND = 'race,archetype,background,portraits';
const DEFAULT_FILTER = '';
const DEFAULT_SORT = '-created';

const filters: IFilters = { original: [], quality: [], colors: [], tags: [], styles: [] };
const sorting: ISorting = { key: 'created', order: 'desc' };

export const load: PageServerLoad = async ({ url, fetch }) => {
  try {
    const page = 1;
    const filter = url.searchParams.get('filter') || DEFAULT_FILTER;
    const sort = url.searchParams.get('sort') || DEFAULT_SORT;
    const params = new URLSearchParams({ page: page.toString(), filter, sort, expand: EXPAND });

    const [charactersRes, racesData, archetypesData, backgroundsData, tagsData] = await Promise.all(
      [
        fetch(`/api/characters?${params.toString()}`),
        getFullList('races'),
        getFullList('archetypes'),
        getFullList('backgrounds'),
        getFullList('tags')
      ]
    );

    const charactersList = await (<Promise<IListResult<ICharacter>>>charactersRes.json());
    const characters = makePOJO(charactersList.items);
    const hasMore = charactersList.totalPages > 1;

    const races = racesData.map((race) => makePOJO(race));
    const archetypes = archetypesData.map(({ id, name }) => ({ id, name }));
    const backgrounds = backgroundsData.map(({ id, name }) => ({ id, name }));
    const tags = tagsData.map(({ id, name, image }) => ({ id, name, image }));

    return {
      page,
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
      page: 1,
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
