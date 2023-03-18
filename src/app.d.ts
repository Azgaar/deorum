/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

import { type Role } from '$lib/config';

// See https://kit.svelte.dev/docs/types#app

declare namespace App {
  // interface Locals {}
  interface PageData {
    params?: {
      slug: string;
    };
    lang: string;
    userId: string | null;
    email: string | null;
    role: Role;
    liked: string[];
  }
  // interface Error {}
  // interface Platform {}
}

interface HTMLImageElement extends HTMLElement {
  fetchPriority?: 'high' | 'low' | 'auto';
}

declare const APP_VERSION: string;

declare module 'webp-converter';

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:swipeRight'?: (e: CustomEvent) => void;
    'on:swipeLeft'?: (e: CustomEvent) => void;
    'on:swipeUp'?: (e: CustomEvent) => void;
    'on:swipeDown'?: (e: CustomEvent) => void;
    'on:clickOutside'?: (e: CustomEvent) => void;
  }
}

interface Navigator {
  connection?: {
    effectiveType: string;
  };
}
