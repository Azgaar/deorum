import { writable } from 'svelte/store';

export const isLoading = writable<boolean>(false);

export const showLoadingOverlay = () => {
  isLoading.set(true);
};

export const hideLoadingOverlay = () => {
  isLoading.set(false);
};
