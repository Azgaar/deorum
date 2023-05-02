import PocketBase from 'pocketbase';

import { URL, COOKIE_NAME, Role } from '$lib/config';
import { makePOJO } from '$lib/utils/object';

import type { IUser } from '$lib/types/api.types';
import { REGISTRATION_BONUS } from '$lib/config/coins';

export const isSignedIn = (instance: PocketBase): boolean => Boolean(instance.authStore.model?.id);

export const signup = async ({
  email,
  password,
  lang,
  name
}: {
  email: string;
  password: string;
  lang: string;
  name: string;
}) => {
  const client = new PocketBase(URL);
  const user = await client.users.create({ email, password, passwordConfirm: password });
  await client.users.authViaEmail(email, password);

  if (user.profile) {
    await client.records.update('profiles', user.profile.id, {
      lang,
      name,
      role: Role.USER,
      coins: REGISTRATION_BONUS
    });
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
  }
};

export const signin = async ({ email, password }: { email: string; password: string }) => {
  const client = new PocketBase(URL);
  await client.users.authViaEmail(email, password);
  document.cookie = client.authStore.exportToCookie({ httpOnly: false });
};

export const logout = () => {
  document.cookie = `${COOKIE_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const unauthorized = { user: null, client: null };

export const authorize = async (request: Request) => {
  const cookie = request.headers?.get('cookie');
  if (!cookie) return Promise.resolve(unauthorized);

  const client = new PocketBase(URL);
  client.authStore.loadFromCookie(cookie);

  // check if cookie is invalid
  if (!client.authStore.model?.id) return Promise.resolve(unauthorized);

  const { id } = client.authStore.model;
  const userData = await client.users.getOne(id);
  const user = makePOJO(userData) as unknown as IUser;
  return { user, client };
};
