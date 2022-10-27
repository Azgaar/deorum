import { logout } from '$lib/api/auth';
import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async () => {
  logout();

  throw redirect(302, '/signin');
};
