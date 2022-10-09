import { clearAuthData, setAuthData } from '$lib/utils/auth';

import { Role } from '$lib/stores/auth';

import client from './client';
import type { IUser } from '$lib/api.types';

export const signup = async ({
  email,
  password,
  lang
}: {
  email: string;
  password: string;
  lang: string;
}) => {
  const role = Role.USER;
  const user = await client.users.create({ email, password, passwordConfirm: password });
  const userData = await client.users.authViaEmail(email, password);

  if (user.profile) {
    await client.records.update('profiles', user.profile.id, { lang, role });
    setAuthData(userData.user);
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
  }
};

export const signin = async ({ email, password }: { email: string; password: string }) => {
  const userData = await client.users.authViaEmail(email, password);
  setAuthData(userData.user);
  document.cookie = client.authStore.exportToCookie({ httpOnly: false });
};

export const logout = () => {
  client.authStore.clear();
  clearAuthData();
};

export const authorize = async (cookie: string) => {
  client.authStore.loadFromCookie(cookie);
  // check if cookie is invalid or empty
  if (!client.authStore.model?.id) return null;

  const { id } = client.authStore.model;
  const userData = await client.users.getOne(id);
  const user: IUser = JSON.parse(JSON.stringify(userData)); // fix non-POJO error
  return user;
};
