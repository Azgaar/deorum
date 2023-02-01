import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async () => {
  throw redirect(307, `/match/tags`);
};
