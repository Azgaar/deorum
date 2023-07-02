export interface IPortraitFilters {
  original: string[];
  quality: string[];
  colors: string[];
  tags: string[];
  styles: string[];
  hasCharacters: boolean | null;
}

export interface ICharacterFilters {
  name: string;
  bio: string;
  gender: string;
  race: string[];
  archetype: string[];
  background: string[];
}

export interface ISorting {
  key: string;
  order: 'asc' | 'desc' | 'no';
}

export type TSelectElement = { id: string; name: string; image?: string };
