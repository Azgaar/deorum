import { get } from 'svelte/store';

import { user } from '$lib/stores';
import { dev } from '$app/environment';

const style = 'color: #fff; background: #000; padding: 2px 4px; border-radius: 3px;';

export const log = (domain: string, message: string, ...args: unknown[]) => {
  if (dev) console.info(`%c${domain}`, style, message);
  else console.info(`${domain}: ${message}`, { user: get(user) }, ...args);
};

export const report = (domain: string, error: unknown, ...args: unknown[]) => {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : '';

  if (dev) console.error(`%c${domain}`, style, message);
  else console.error(`${domain}: ${message}`, { user: get(user) }, stack, ...args);
};
