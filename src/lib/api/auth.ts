import PocketBase, { User } from 'pocketbase';

import { URL, COOKIE_NAME } from '$lib/config';
import { user, role, Role } from '$lib/stores';
import { makePOJO } from '$lib/utils/object';

import type { IUser } from '$lib/types/api.types';

export const isSignedIn = (instance: PocketBase): boolean => Boolean(instance.authStore.model?.id);

const setAuthData = (userData: User) => {
  const { email, profile } = userData;
  const { role: userRole } = (profile as unknown as { role: Role }) || {};

  user.set(email);
  role.set(userRole);
};

export const signup = async ({
  email,
  password,
  lang
}: {
  email: string;
  password: string;
  lang: string;
}) => {
  const client = new PocketBase(URL);
  const user = await client.users.create({ email, password, passwordConfirm: password });
  const userData = await client.users.authViaEmail(email, password);

  if (user.profile) {
    await client.records.update('profiles', user.profile.id, { lang, role: Role.USER });
    setAuthData(userData.user);
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
  }
};

export const signin = async ({ email, password }: { email: string; password: string }) => {
  const client = new PocketBase(URL);
  const userData = await client.users.authViaEmail(email, password);
  setAuthData(userData.user);
  document.cookie = client.authStore.exportToCookie({ httpOnly: false });
};

export const logout = () => {
  user.set(null);
  role.set(Role.GUEST);
  document.cookie = `${COOKIE_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const authorize = async (cookie: string) => {
  const client = new PocketBase(URL);
  client.authStore.loadFromCookie(cookie);

  // check if cookie is invalid or empty
  if (!client.authStore.model?.id) return null;

  const { id } = client.authStore.model;
  const userData = await client.users.getOne(id);
  const user = makePOJO(userData) as unknown as IUser;
  return user;
};
