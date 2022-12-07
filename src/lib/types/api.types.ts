import type { Role } from '../stores/auth';

export interface IListResult<M> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Array<M>;
}

interface IRecord {
  '@collectionId': string;
  '@collectionName': string;
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
  };
}

export interface ITag extends IRecord {
  name: string;
  emoji: string;
  image: string;
}

export interface IStyle extends IRecord {
  name: string;
  emoji: string;
  image: string;
}

export interface IColor extends IRecord {
  name: string;
  image: string;
}

export interface IQuality extends IRecord {
  name: string;
  emoji: string;
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
}

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
  email: string;
  verified: boolean;
  lastResetSentAt: string;
  lastVerificationSentAt: string;

  profile: IRecord & {
    role: Role;
    lang: string;
  };
}

export interface IOriginal extends IRecord {
  image: string;
  name: string;
}

export interface IStyle extends IRecord {
  emoji: string;
  name: string;
}

export interface ITag extends IRecord {
  emoji: string;
  name: string;
}
