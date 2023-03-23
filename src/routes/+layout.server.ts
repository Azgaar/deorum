import { authorize } from '$lib/api/auth';
import { locales } from '$lib/locales/translations';
import { Role } from '$lib/config';

import type { Config } from '@sveltejs/adapter-vercel';
import type { IUser } from '$lib/types/api.types';

export const config: Config = {
  runtime: 'nodejs18.x'
};

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
  const email = user?.email || null;
  const role = user?.profile.role || Role.GUEST;
  const liked = user?.profile.liked || [];

  depends('app:userData');

  return { lang, userId, email, role, liked };
};
