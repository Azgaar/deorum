import type { User } from 'pocketbase';

import { toastError } from '$lib/stores';
import { clearAuthData, setAuthData } from '$lib/utils/auth';

import type { PBError } from '$lib/error.types';

import client from './client';
import type { IUser } from '$lib/api.types';

export const signup = async ({ email, password }: { email: string; password: string }) => {
  try {
    await client.users.create({ email, password, passwordConfirm: password });
    const userData = await client.users.authViaEmail(email, password);
    setAuthData(userData.user);
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
    // set language: window.navigator.language
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  }
};

export const signin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const userData = await client.users.authViaEmail(email, password);
    setAuthData(userData.user);
    document.cookie = client.authStore.exportToCookie({ httpOnly: false });
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  }
};

export const logout = () => {
  client.authStore.clear();
  clearAuthData();
};

export const authorize = async (cookie: string) => {
  try {
    client.authStore.loadFromCookie(cookie);
    // check if cookie is invalid or empty
    if (!client.authStore.model?.id) return null;

    const { id } = client.authStore.model;
    const userData = await client.users.getOne(id);
    const user: IUser = JSON.parse(JSON.stringify(userData)); // fix non-POJO error
    return user;
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
    return null;
  }
};
