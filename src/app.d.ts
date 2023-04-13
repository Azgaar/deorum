import { type Role } from '$lib/config';

declare global {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
      'on:swipeRight'?: (e: CustomEvent) => void;
      'on:swipeLeft'?: (e: CustomEvent) => void;
      'on:swipeUp'?: (e: CustomEvent) => void;
      'on:swipeDown'?: (e: CustomEvent) => void;
      'on:clickOutside'?: (e: CustomEvent) => void;
      'on:dialogOpen'?: (e: CustomEvent) => void;
      'on:dialogClose'?: (e: CustomEvent) => void;
    }
  }

  interface Navigator {
    connection?: {
      effectiveType: string;
    };
  }
}

export {};
