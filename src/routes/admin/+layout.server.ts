import { redirect } from '@sveltejs/kit';

import { Role } from '$lib/stores/auth';

export const load: import('./$types').LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent();
  const role = user?.profile.role;

  if (role !== Role.ADMIN) {
    throw redirect(302, '/signin');
  }

  return {};
};
