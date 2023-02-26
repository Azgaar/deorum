import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { domain, message, user, args } = await request.json();
  console.info(`CLIENT ${domain}: ${message}`, ...args, user);

  return json({ message: 'ok' });
};
