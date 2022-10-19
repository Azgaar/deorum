import type { Role } from './stores/auth';

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
}

export interface IPortrait extends IRecord {
  image: string;
  original: string;
  tags: string[];
  styles: string[];
  colors: string[];
  quality: number;
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
