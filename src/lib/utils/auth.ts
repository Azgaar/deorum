import type { User } from 'pocketbase';

import { user, role } from '$lib/stores';
import { Role } from '$lib/stores/auth';
import { COOKIE_NAME } from '$lib/config';

export const setAuthData = (userData: User) => {
  const { email, profile } = userData;
  const { role: userRole } = (profile as unknown as { role: Role }) || {};

  user.set(email);
  role.set(userRole);
};

export const clearAuthData = () => {
  user.set(null);
  role.set(Role.GUEST);
  document.cookie = `${COOKIE_NAME}=`;
};
