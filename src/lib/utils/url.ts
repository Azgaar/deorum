import { URL } from '$lib/config';
import type { TCollection } from '$lib/types/api.types';

export const concatImgSrc = (collection: TCollection, id: string, image: string) =>
  `${URL}/api/files/${collection}/${id}/${image}`;
