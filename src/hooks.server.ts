import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';

import admin from '$lib/api/admin';
import { authorize, isSignedIn } from '$lib/api/auth';
import { COOKIE_NAME } from '$lib/config';
import { Role } from '$lib/stores';

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

  let lang = 'auto';
  const cookie = event.cookies.get(COOKIE_NAME);
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      lang = parsed.model.profile.lang;
    } catch (error) {
      console.error(error);
    }
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
