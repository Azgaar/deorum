import { toastError } from '$lib/stores';
import type {
  IArchetype,
  IBackground,
  IColor,
  IList,
  IOriginal,
  IPortrait,
  IRace,
  IStyle,
  ITag
} from '$lib/types/api.types';
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
      sort: url.searchParams.get('sort') || DEFAULT_SORT
    });
    url.searchParams.getAll('filter').forEach((value) => params.append('filter', value));

    const [portraitsList, originals, tags, styles, colors, races, archetypes, backgrounds] =
      await Promise.all([
        toJson<IList<IPortrait>>(fetch(`/api/portraits?${params}`)),
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
