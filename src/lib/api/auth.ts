import type { PBError } from '$lib/error.tyoes';
import { user, role, toastError } from '$lib/stores';
import { isLoading, Role } from '$lib/stores/auth';

import client from './client';

export const signinOnLoad = async () => {
  try {
    const storedToken = localStorage?.getItem('pocketbase_auth');
    const storedRole = localStorage?.getItem('pocketbase_role');
    const validRole = storedRole && Object.values(Role).includes(storedRole as Role);

    if (storedToken && validRole) {
      const userRole = storedRole as Role;
      const api = userRole === Role.ADMIN ? 'admins' : 'users';
      const userData = await client[api].refresh();
      user.set(userData[userRole].email);
      role.set(userRole);
    }
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  } finally {
    isLoading.set(false);
  }
};

export const signup = async ({ email, password }: { email: string; password: string }) => {
  try {
    await client.users.create({ email, password, passwordConfirm: password });
    await client.users.authViaEmail(email, password);

    user.set(email);
    role.set(Role.USER);

    localStorage?.setItem('pocketbase_role', Role.USER);
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  }
};

export const signin = async ({
  isAdmin,
  email,
  password
}: {
  isAdmin: boolean;
  email: string;
  password: string;
}) => {
  try {
    const api = isAdmin ? 'admins' : 'users';
    await client[api].authViaEmail(email, password);

    const userRole = isAdmin ? Role.ADMIN : Role.USER;
    localStorage?.setItem('pocketbase_role', userRole);

    user.set(email);
    role.set(userRole);
  } catch (error) {
    console.error(error);
    toastError((error as PBError).message);
  }
};

export const logout = () => {
  user.set(null);
  role.set(Role.GUEST);
  client.authStore.clear();
};
