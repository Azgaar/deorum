import { get } from 'svelte/store';

import { user } from '$lib/stores';

const style = 'color: #fff; background: #000; padding: 2px 4px; border-radius: 3px;';

export const log = (domain: string, message: string, ...args: unknown[]) => {
  console.info(`%c${domain}%c ${message}`, style, '', { user: get(user) }, ...args);
};

export const report = (domain: string, error: unknown, ...args: unknown[]) => {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : '';

  console.error(`%c${domain}%c ${message}`, style, '', { user: get(user) }, stack, ...args);
};
