import { writable } from 'svelte/store';

export const galleryId = writable<null | string>(null);
