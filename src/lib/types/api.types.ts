import type { Role } from '$lib/config';

export type TCollection =
  | 'portraits'
  | 'characters'
  | 'custom'
  | 'originals'
  | 'tags'
  | 'styles'
  | 'colors'
  | 'quality'
  | 'races'
  | 'archetypes'
  | 'backgrounds';

export interface IList<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Array<T>;
}

export interface IRecord {
  '@collectionId': string;
  '@collectionName': TCollection;
  '@expand': {
    [key: string]: unknown;
  };
  id: string;
  created: string;
  updated: string;
}

export interface IPortrait extends IRecord {
  id: string;
  image: string;
  original: string;
  tags: string[];
  styles: string[];
  colors: string[];
  quality: number;
  characters: string[];

  '@expand': {
    original?: IOriginal;
    tags?: ITag[];
    styles?: IStyle[];
    characters?: ICharacter[];
  };

  user?: string; // uploaded userId
}

export interface IOriginal extends IRecord {
  image: string;
  name: string;
}

export interface ITag extends IRecord {
  name: string;
  image: string;
}

export interface IStyle extends IRecord {
  name: string;
  image: string;
}

export interface IColor extends IRecord {
  name: string;
  image: string;
}

export interface IQuality extends IRecord {
  name: string;
  image: string;
}

export type TGender = 'male' | 'female' | 'non-binary';

export interface ICharacter extends IRecord {
  name: string;
  age: number;
  gender: TGender | '';
  race: string;
  archetype: string;
  background: string;
  portraits: string[];
  weight: number;
  height: number;
  bio: string;
  tags: string[];

  '@expand': {
    race?: IRace;
    archetype?: IArchetype;
    background?: IBackground;
    portraits?: IPortrait[];
    tags?: ITag[];
  };

  likes?: string[]; // ids of users who liked, for precreated characters only
  creator?: string; // user id, for custom characters only
  source?: string; // character id, for custom characters only
}

// custom (created/edited) character

export interface IRace extends IRecord {
  name: string;
  image: string;

  ageMean: number;
  ageDeviation: number;
  ageMin: number;
  ageMax: number;

  heightMean: number;
  heightDeviation: number;
  heightGenderDeviation: number;

  weightMean: number;
  weightDeviation: number;
  weightGenderDeviation: number;
}

export interface IArchetype extends IRecord {
  name: string;
}

export interface IBackground extends IRecord {
  name: string;
}

export interface IUser {
  id: string;
  email: string;
  verified: boolean;
  lastResetSentAt: string;
  lastVerificationSentAt: string;

  profile: IRecord & {
    name: string;
    role: Role;
    lang: string;
    liked: string[];
    coins: number;
  };
}
