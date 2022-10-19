import { authorize } from '$lib/api/auth';
import { locales } from '$lib/locales/translations';
import { toastError } from '$lib/stores';

import type { IUser } from '$lib/types/api.types';
import type { PBError } from '$lib/types/error.types';

const getLocale = (request: Request, user: IUser | null) => {
  if (user?.profile?.lang) return user.profile.lang;

  const accepted = request.headers.get('accept-language');
  const primary = accepted?.split(',')[0];
  if (primary && locales.get().includes(primary)) return primary;

  return 'en'; // fallback
};

export const load: import('./$types').LayoutServerLoad = async ({ request }) => {
  let user: IUser | null = null;

  try {
    const cookie = request.headers.get('cookie');
    if (cookie) user = await authorize(cookie);
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  }

  const lang = getLocale(request, user);

  return { lang, user };
};
