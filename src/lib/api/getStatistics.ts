import type { IListResult, IOriginal, IPortrait } from '$lib/api.types';
import client from './client';

const ALL = 500;
const SINGLE = 1;
const FILTER = 'active = true';

export async function getOriginalsStatistics() {
  const originals = (await client.records.getFullList('originals', ALL)) as unknown as IOriginal[];

  const promises = originals?.map(async ({ id }) => {
    return client.records.getList('portraits', SINGLE, SINGLE, {
      filter: `${FILTER} && original.id = '${id}'`,
      $autoCancel: false
    }) as unknown as IListResult<IPortrait>;
  });

  const portraits = await Promise.all(promises);

  const result = originals.map(({ id, image, name }, index) => {
    const items = portraits[index]?.totalItems;
    return { id, image, name, items };
  });

  return result;
}
