import { writable } from 'svelte/store';

import { normalizeError } from '$lib/utils/errors';

export const snackbar = writable<{
  message: null | string;
  status: 'success' | 'error' | 'warning' | 'info';
}>({
  message: null,
  status: 'success'
});

export const toastError = (error: unknown) => {
  const message = normalizeError(error);
  snackbar.set({ message, status: 'error' });
};

export const toastSuccess = (message: string) => {
  snackbar.set({ message, status: 'success' });
};

export const toastInfo = (message: string) => {
  snackbar.set({ message, status: 'info' });
};
