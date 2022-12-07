import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
  throw redirect(308, '/admin/characters/statistics/races');
}
