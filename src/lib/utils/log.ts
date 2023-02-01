import { get } from 'svelte/store';

import { page } from '$app/stores';
import { browser } from '$app/environment';
import { request } from '$lib/utils/requests';
import { catchErrorDetails, normalizeError } from './errors';

const style = 'color: #fff; background: #000; padding: 2px 4px; border-radius: 3px;';

export const log = (domain: string, message: string, ...args: unknown[]) => {
  if (browser) {
    console.info(`%c${domain}`, style, message);
    const user = get(page).data.email;
    request('/api/log', 'POST', { domain, message, user, args });
  } else console.info(`SERVER ${domain}: ${message}`, ...(args || ''));
};

export const report = (domain: string, err: unknown, ...args: unknown[]) => {
  const message = normalizeError(err);
  let details = catchErrorDetails(err);
  if (details === message) details = null;

  if (browser) {
    console.error(`%c${domain}`, style, message, args);
    const user = get(page).data.email;
    request('/api/report', 'POST', { domain, message, details, user, args });
  } else console.error(`SERVER ${domain}: ${message}`, details, ...(args || ''));
};
