import { getCachedList } from '$lib/cache/cacheInstance';
import type { IStyle } from '$lib/types/api.types';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { concatImgSrc } from '$lib/utils/url';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const purgeData = ({ id, name, image }: IStyle) => ({
  id,
  name,
  image: concatImgSrc('styles', id, image)
});

export const GET: RequestHandler = async () => {
  try {
    const data = await getCachedList<IStyle>('styles');
    const styles = data.map(purgeData);
    return json(styles);
  } catch (err) {
    report('styles', err);
    throw createServerError(err);
  }
};
