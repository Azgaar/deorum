import type { ISorting } from '$lib/types/filters.types';

const operatorsMap: { [key: string]: '=' | '~' } = {
  name: '~',
  bio: '~',
  gender: '=',
  quality: '='
};

function parse(value: unknown) {
  return typeof value === 'string' ? `"${value}"` : value;
}

export function parseFilters(filters: object): string[] {
  const query = Object.entries(filters).map(([key, value]) => {
    if (value === null) return '';

    if (key === 'hasCharacters') return value ? 'characters!="[]"' : 'characters="[]"';
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      const operator = operatorsMap[key] || '~';
      return '(' + value.map((value) => `${key}${operator}${parse(value)}`).join('||') + ')';
    }

    const operator = operatorsMap[key] || '=';
    return value ? `${key}${operator}${parse(value)}` : '';
  });

  return query.filter(Boolean);
}

export function parseSorting(sorting: ISorting) {
  return sorting.order === 'no' ? '' : `${sorting.order === 'desc' ? '-' : ''}${sorting.key}`;
}

export function parseParamsToFilters<T>(
  url: string | undefined,
  defaultFilters: Record<string, string | string[] | null>
) {
  if (!url) return defaultFilters as T;
  const filters = { ...defaultFilters };
  const searchFilters = new URLSearchParams(url).getAll('filter') || [];

  searchFilters.forEach((filter) => {
    const filterString = decodeURIComponent(filter).replace(/[()"]/g, '');
    const parts = filterString.split('||');

    parts.forEach((part) => {
      const [key, , value] = part.split(/(=|!=|>|>=|<|<=|~|!~)/);
      if (key && value) {
        if (Array.isArray(filters[key])) (filters[key] as string[]).push(value);
        else filters[key] = value;
      }
    });
  });

  return filters as T;
}

export function parseParamsToSorting(url: string | undefined, defaultSorting: ISorting): ISorting {
  const searchSort = new URLSearchParams(url).get('sort') || '';
  if (!searchSort) return defaultSorting;

  const order = searchSort.startsWith('-') ? 'desc' : 'asc';
  const key = searchSort.replace(/^-/, '');
  return { key, order };
}
