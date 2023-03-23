import { writable } from 'svelte/store';

export const galleryNextId = writable<null | string>(null);
