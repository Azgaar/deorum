import type { IPortrait } from '$lib/types/api.types';

export const blankPortrait: IPortrait = {
  id: '',
  image: '',
  original: '',
  tags: [],
  styles: [],
  colors: [],
  quality: 0,
  characters: [],

  created: '',
  updated: '',

  '@collectionId': '',
  '@collectionName': 'portraits',
  '@expand': {}
};
