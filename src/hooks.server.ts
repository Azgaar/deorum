import { sequence } from '@sveltejs/kit/hooks';
import type { Cookies } from '@sveltejs/kit';

import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import admin from '$lib/api/admin';
import { authorize, isSignedIn } from '$lib/api/auth';
import { COOKIE_NAME, Role } from '$lib/config';
import { report } from '$lib/utils/log';

const redirectToSignIn = (sourceUrl: string) =>
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

const protectRoutes: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  const url = event.request.url;
  const target = new URL(url).pathname;

  const isProtected = protectedRoutes.some((route) => target.includes(route));
  if (isProtected) {
    const cookie = event.request.headers.get('cookie');
    if (!cookie) return redirectToSignIn(target);

    const user = await authorize(cookie);
    if (!user) return redirectToSignIn(target);

    const role: Role = user?.profile?.role || Role.GUEST;
    const allowedRoutes = routesProtection[role];
    if (allowedRoutes.every((route) => !url.includes(route))) return redirectToSignIn(target);
  }

  return resolve(event);
};

// login as evergreen admin user to run PocketBase requests on guest user behalf
const loginAsExecuter: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  if (!isSignedIn(admin)) await admin.users.authViaEmail(ADMIN_USERNAME, ADMIN_PASSWORD);
  return resolve(event);
};

const setPageLanguage: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', getPageLanguage(event.cookies))
  });
};

export const handle = sequence(protectRoutes, loginAsExecuter, setPageLanguage);
