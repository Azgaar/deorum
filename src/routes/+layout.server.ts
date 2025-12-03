import { authorize } from '$lib/api/auth';
import { KEYS, Role } from '$lib/config';
import { locales } from '$lib/locales/translations';

import type { IUser } from '$lib/types/api.types';

const getLocale = (request: Request, user: IUser | null) => {
  if (user?.profile?.lang) return user.profile.lang;

  const accepted = request.headers.get('accept-language');
  const primary = accepted?.split(',')[0];
  if (primary && locales.includes(primary)) return primary;

  return 'en'; // fallback
};

export const load: import('./$types').LayoutServerLoad = async ({ request, depends }) => {
  const { user } = await authorize(request);

  const lang = getLocale(request, user);
  const userId = user?.id || null;
  const name = user?.profile.name || '';
  const email = user?.email || '';
  const role = user?.profile.role || Role.GUEST;
  const liked = user?.profile.liked || [];
  const coins = user?.profile.coins || 0;

  depends(KEYS.USER_DATA);

  return { lang, userId, name, email, role, liked, coins };
};
