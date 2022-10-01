import type { IFilters } from '$lib/filters.types';

export function parseFilters(filters: IFilters) {
  let query = '';

  for (const key in filters) {
    const values = filters[key as keyof IFilters];
    if (values.length) {
      const base = values.map((value) => `${key}=${parse(value)}`).join(' || ');
      query += `${query ? ' && ' : ''}(${base})`;
    }
  }

  return query;
}

function parse(value: string | number | boolean) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return value;
}
