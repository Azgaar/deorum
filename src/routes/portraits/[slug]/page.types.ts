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
}

export interface IStyle extends IRecord {
  name: string;
  emoji: string;
}
