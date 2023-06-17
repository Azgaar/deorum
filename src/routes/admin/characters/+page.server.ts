import { charactersConfig } from '$lib/config';
import { toastError } from '$lib/stores';
import type { IArchetype, IBackground, ICharacter, IList, IRace, ITag } from '$lib/types/api.types';
import { report } from '$lib/utils/log';
import { toJson } from '$lib/utils/requests';
import type { PageServerLoad } from './$types';

export const ssr = true;

const DEFAULT_SORT = '-created';
const pageSize = 100;
const page = 1;

export const load: PageServerLoad = async ({ url, fetch }) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort: url.searchParams.get('sort') || DEFAULT_SORT,
      expand: charactersConfig.expand
    });
    url.searchParams.getAll('filter').forEach((value) => params.append('filter', value));

    const [charactersList, tags, races, archetypes, backgrounds] = await Promise.all([
      toJson<IList<ICharacter>>(fetch(`/api/characters?${params}`)),
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
      characters: [],
      races: [],
      archetypes: [],
      backgrounds: [],
      tags: []
    };
  }
};
