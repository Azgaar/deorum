import { redirect } from '@sveltejs/kit';

export const load: import('./$types').LayoutServerLoad = async ({ parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(302, '/signin');

  return {};
};
