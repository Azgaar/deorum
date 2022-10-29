import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ parent }) => {
  const { currentId } = await parent();
  throw redirect(307, `/match/names/${currentId}`);
};
