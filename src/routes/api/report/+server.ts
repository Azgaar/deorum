import type { RequestHandler } from './$types';

// get requesy body
export const POST: RequestHandler = async ({ request }) => {
  const { domain, message, user, args } = await request.json();
  console.error(`${domain}: ${message}`, { user }, ...args);

  return new Response();
};
