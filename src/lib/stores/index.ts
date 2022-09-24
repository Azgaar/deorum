import { writable } from 'svelte/store';

export const snackbar = writable<{
  message: null | string;
  status: 'success' | 'error' | 'warning';
}>({
  message: null,
  status: 'success'
});
