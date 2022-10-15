import { redirect } from '@sveltejs/kit';

export const prerender = true;
export const csr = false;

/** @type {import('./$types').PageLoad} */
export async function load() {
  throw redirect(308, '/admin/statistics/originals');
}
