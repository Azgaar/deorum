import { writable } from 'svelte/store';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export const user = writable<string | null>(null);

export const role = writable<Role>(Role.GUEST);

export const isLoading = writable<boolean>(false);
