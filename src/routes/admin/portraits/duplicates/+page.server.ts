import { toastError } from '$lib/stores';
import { report } from '$lib/utils/log';

import type { IPortrait } from '$lib/types/api.types';
import type { PageServerLoad } from '../../characters/$types';

export const ssr = true;

export const load: PageServerLoad = async ({ url, fetch }) => {
  try {
    const res = await fetch(`/api/portraits/all?sort=-created`);
    const allPortraits = await (<Promise<IPortrait[]>>res.json());
    const portraitData = allPortraits.map(({ id, image }) => ({ id, image }));

    return { portraitData };
  } catch (error) {
    report('admin', error, url);
    toastError(error);

    return { portraitData: [] };
  }
};
