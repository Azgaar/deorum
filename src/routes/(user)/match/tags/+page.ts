import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ parent }) => {
  const { current } = await parent();
  throw redirect(307, `/match/tags/${current.id}`);
};
