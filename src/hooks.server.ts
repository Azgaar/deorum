import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

import admin from '$lib/api/admin';
import { authorize, isSignedIn } from '$lib/api/auth';
import { COOKIE_NAME } from '$lib/config';
import { Role } from '$lib/stores';
import { report } from '$lib/utils/log';

const redirect = (sourceUrl: string) =>
  new Response(null, {
    status: 307,
    headers: { location: `/signin?unauthorized=true&to=${sourceUrl}` }
  });

const protectedRoutes = ['admin', 'match'];
const routesProtection = {
  [Role.ADMIN]: ['admin', 'match'],
  [Role.USER]: ['match'],
  [Role.GUEST]: [] as string[]
};

const getPageLanguage = (cookies: Cookies) => {
  const cookie = cookies.get(COOKIE_NAME);
  if (!cookie) return 'auto';

  try {
    const parsed = JSON.parse(cookie);
    return parsed.model.profile.lang;
  } catch (error) {
    report('cookie', error);
    return 'auto';
  }
};

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  const target = new URL(event.request.url).pathname;

  const isProtected = protectedRoutes.some((route) => target.includes(route));
  if (isProtected) {
    const cookie = event.request.headers.get('cookie');
    if (!cookie) return redirect(target);

    const user = await authorize(cookie);
    if (!user) return redirect(target);

    const allowedRoutes = routesProtection[user?.profile?.role];
    if (!allowedRoutes.some((route) => event.request.url.includes(route))) return redirect(target);
  }

  // login as executer: evergreen admin user to run PocketBase requests on guest user behalf
  if (!isSignedIn(admin)) await admin.users.authViaEmail(ADMIN_USERNAME, ADMIN_PASSWORD);

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', getPageLanguage(event.cookies))
  });
};
