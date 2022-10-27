import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async () => {
  throw redirect(302, '/gallery');
};
