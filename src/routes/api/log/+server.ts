import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { domain, message, user, args } = await request.json();
  console.info(`${domain}: ${message}`, ...args, user);

  return new Response(JSON.stringify({ message: 'ok' }));
};
