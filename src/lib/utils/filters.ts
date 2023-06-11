import type { ISorting } from '$lib/types/filters.types';

const operatorsMap: { [key: string]: '=' | '~' } = {
  name: '~',
  bio: '~',
  gender: '='
};

function parse(value: unknown) {
  return typeof value === 'string' ? `"${value}"` : value;
}

export function parseFilters(filters: object) {
  const query = Object.entries(filters).map(([key, value]) => {
    if (value === null) return '';

    const operator = operatorsMap[key] || '=';
    if (key === 'hasCharacters') return value ? 'characters!="[]"' : 'characters="[]"';
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      return '(' + value.map((value) => `${key}=${parse(value)}`).join('||') + ')';
    }
    return value ? `${key}${operator}${parse(value)}` : '';
  });

  return query.filter(Boolean).join('&&');
}

export function parseSorting(sorting: ISorting) {
  return sorting.order === 'no' ? '' : `${sorting.order === 'desc' ? '-' : ''}${sorting.key}`;
}
