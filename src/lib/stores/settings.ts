import { writable } from 'svelte/store';

export const language = writable<string>('en');
