import { authorize } from '$lib/api/auth';
import { getFullList } from '$lib/api/getData';
import { Role } from '$lib/config';
import { createServerError } from '$lib/utils/errors';
import { report } from '$lib/utils/log';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { IProfile } from '$lib/types/api.types';
import { getCachedList } from '$lib/cache/cacheInstance';

export const GET: RequestHandler = async ({ url, request }) => {
  try {
    const { user } = await authorize(request);
    if (!user || user.profile.role !== Role.ADMIN) throw error(401, 'Unauthorized');

    const filters = url.searchParams.getAll('filter');
    const sort = url.searchParams.get('sort') || '';
    const expand = url.searchParams.get('expand') || '';

    const profiles = await getCachedList<IProfile>('profiles', filters, sort, expand);
    return json(profiles);
  } catch (err) {
    report('users', err);
    throw createServerError(err);
  }
};
