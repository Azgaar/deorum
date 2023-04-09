import { sequence } from '@sveltejs/kit/hooks';
import { json, type Cookies } from '@sveltejs/kit';

import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import admin from '$lib/api/admin';
import { authorize, isSignedIn } from '$lib/api/auth';
import { COOKIE_NAME, Role } from '$lib/config';
import { report } from '$lib/utils/log';

const protectedPaths = [
  { path: 'admin', roles: [Role.ADMIN] },
  { path: 'myCharacters', roles: [Role.USER, Role.ADMIN] },
  { path: 'match', roles: [Role.USER, Role.ADMIN] }
];

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

const abortRequest = (sourceUrl: string, role: Role) => {
  const isApiCall = sourceUrl.includes('/api/');
  if (isApiCall)
    return json({ message: `This action is allowed only for ${role} users` }, { status: 401 });

  return new Response(null, {
    status: 307,
    headers: { location: `/signin?unauthorized=true&to=${sourceUrl}&role=${role}` }
  });
};

const protectRoutes: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  const url = event.request.url;
  const target = new URL(url).pathname;

  const protectedPath = protectedPaths.find(({ path }) => target.includes(path));
  if (protectedPath) {
    const { user } = await authorize(event.request);
    if (!user) return abortRequest(target, protectedPath.roles[0]);

    const role: Role = user?.profile?.role || Role.GUEST;
    if (!protectedPath.roles.includes(role)) return abortRequest(target, protectedPath.roles[0]);
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
