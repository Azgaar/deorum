export interface IFilters {
  original: string[];
  quality: number[];
  colors: string[];
  tags: string[];
  styles: string[];
}

export interface ISorting {
  key: keyof IFilters | 'created';
  order: 'asc' | 'desc' | 'no';
}
