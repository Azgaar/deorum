import { getFullList } from '$lib/api/getFullList';
import { RACES_IMAGE_PATH } from '$lib/config';
import type { IStatistics } from '$lib/types/statistics.types';

export const csr = false;

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/40';

export const load: import('./$types').PageServerLoad = async () => {
  const [characters, races] = await Promise.all([getFullList('characters'), getFullList('races')]);
  const racesMap = new Map(races.map(({ id, image, name }) => [id, { image, name }]));

  // aggregate data
  const aggregated = characters.reduce((acc, { race }) => {
    if (!acc[race]) acc[race] = 0;
    acc[race] += 1;

    return acc;
  }, {} as { [race: string]: number });

  for (const { id } of races) {
    if (!aggregated[id]) aggregated[id] = 0;
  }

  const statistics: IStatistics[] = Object.entries(aggregated)
    .map(([id, count]) => {
      const { name, image } = racesMap.get(id) || {};
      const src = image ? `${RACES_IMAGE_PATH}/${id}/${image}` : PLACEHOLDER_IMAGE;
      return { name, image: src, count };
    })
    .sort((a, b) => b.count - a.count);

  return { statistics };
};
