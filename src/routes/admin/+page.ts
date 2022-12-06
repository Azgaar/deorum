import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async () => {
  throw redirect(307, `/admin/portraits`);
};
