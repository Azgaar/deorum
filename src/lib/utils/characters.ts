import type { ICharacter } from '$lib/types/api.types';

export const blankCharacter: ICharacter = {
  id: '',
  name: '',
  age: 0,
  gender: '',
  race: '',
  archetype: '',
  background: '',
  portraits: [],

  '@collectionId': '',
  '@collectionName': '',
  '@expand': {}
};
