import { writable } from 'svelte/store';

export const snackbar = writable<{
  message: null | string;
  status: 'success' | 'error' | 'warning' | 'info';
}>({
  message: null,
  status: 'success'
});

export const toastError = (message: string) => {
  snackbar.set({ message, status: 'error' });
};

export const toastSuccess = (message: string) => {
  snackbar.set({ message, status: 'success' });
};
