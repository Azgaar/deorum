import type { IFilters } from '$lib/filters.types';

const operatorsMap: { [key in keyof IFilters]: '=' | '~' } = {
  original: '=',
  quality: '=',
  colors: '~',
  tags: '=',
  styles: '='
};

export function parseFilters(filters: IFilters) {
  let query = '';

  for (const key in filters) {
    const entity = key as keyof IFilters;
    const values = filters[entity];
    if (values.length) {
      const base = values
        .map((value) => `${key}${operatorsMap[entity]}${parse(value)}`)
        .join(' || ');

      query += `${query ? ' && ' : ''}(${base})`;
    }
  }

  return query;
}

function parse(value: string | number | boolean) {
  return typeof value === 'string' ? `"${value}"` : value;
}
