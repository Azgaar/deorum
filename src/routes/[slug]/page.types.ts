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
}

export interface IPortrait extends IRecord {
  id: string;
  image: string;
  original: string;
  tags: string[];
  styles: string[];
  quality: number;
}
