import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { domain, message, details, user, args } = await request.json();
  console.error(`CLIENT ${domain}: ${message}`, details, user, ...args);

  return new Response(JSON.stringify({ message: 'ok' }));
};
