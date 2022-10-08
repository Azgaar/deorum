import { authorize } from '$lib/api/auth';
import type { IUser } from '$lib/api.types';
import { locales } from '$lib/locales/translations';

const getLocale = (request: Request, user: IUser | null) => {
  if (user?.profile?.lang) return user.profile.lang;

  const accepted = request.headers.get('accept-language');
  const primary = accepted?.split(',')[0];
  if (primary && locales.get().includes(primary)) return primary;

  return 'en'; // fallback
};

export const load: import('./$types').LayoutServerLoad = async ({ request }) => {
  let user: IUser | null = null;

  const cookie = request.headers.get('cookie');
  if (cookie) user = await authorize(cookie);

  const lang = getLocale(request, user);

  return { lang, user };
};
