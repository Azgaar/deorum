/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

// See https://kit.svelte.dev/docs/types#app

declare namespace App {
  // interface Locals {}
  interface PageData {
    params?: {
      slug: string;
    };
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
  }
}
