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
  // interface PageError {}
  // interface Platform {}
}

declare const APP_VERSION: string;
