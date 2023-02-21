export interface IPortraitFilters {
  original: string[];
  quality: number[];
  colors: string[];
  tags: string[];
  styles: string[];
  hasCharacters: boolean | null;
}

export interface ICharacterFilters {
  races: string[];
  archetypes: number[];
  backgrounds: string[];
}

export interface ISorting {
  key: string;
  order: 'asc' | 'desc' | 'no';
}
