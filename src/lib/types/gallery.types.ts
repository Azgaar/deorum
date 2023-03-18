import type { TGender } from './api.types';

export interface IGalleryItem {
  id: string;
  image: string;
  name: string;
  gender: TGender | '';
  race: string;
  archetype: string;
  background: string;
  age: number;
  weight: number;
  height: number;
  bio: string;
  likes: string[];
}
