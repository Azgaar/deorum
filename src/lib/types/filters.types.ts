export interface IPortraitFilters {
  original: string[];
  quality: number[];
  color: string[];
  tag: string[];
  style: string[];
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
