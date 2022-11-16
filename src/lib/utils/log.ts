import { get } from 'svelte/store';

import { user } from '$lib/stores';
import { browser } from '$app/environment';
import { request } from '$lib/utils/requests';
import { catchErrorDetails, normalizeError } from './errors';

const style = 'color: #fff; background: #000; padding: 2px 4px; border-radius: 3px;';

export const log = (domain: string, message: string, ...args: unknown[]) => {
  if (browser) {
    console.info(`%c${domain}`, style, message);
    request('/api/log', 'POST', { domain, message, user: get(user), args });
  } else console.info(`SERVER ${domain}: ${message}`, get(user), ...args);
};

export const report = (domain: string, err: unknown, ...args: unknown[]) => {
  const message = normalizeError(err);
  let details = catchErrorDetails(err);
  if (details === message) details = null;

  if (browser) {
    console.error(`%c${domain}`, style, message, args);
    request('/api/report', 'POST', { domain, message, details, user: get(user), args });
  } else console.error(`SERVER ${domain}: ${message}`, details, get(user), ...args);
};
