export interface IPortraitFilters {
  original: string[];
  quality: number[];
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
  age: [number, number];
}

export interface ISorting {
  key: string;
  order: 'asc' | 'desc' | 'no';
}
