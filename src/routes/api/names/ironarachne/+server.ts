import { request } from '$lib/utils/requests';
import type { RequestHandler } from './$types';

const baseUrl = 'https://muna.ironarachne.com';
const defaultRace = 'human';
const defaultType = 'male';

type TRace =
  | 'dragonborn'
  | 'dwarf'
  | 'elf'
  | 'gnome'
  | 'goblin'
  | 'halfling'
  | 'halfelf'
  | 'halforc'
  | 'human'
  | 'orc'
  | 'tiefling'
  | 'troll';
type TType = 'male' | 'female' | 'family';

export const GET: RequestHandler = async ({ url }) => {
  const count = Number(url.searchParams.get('quantity'));
  const race = url.searchParams.get('race') || (defaultRace as TRace);
  const type = url.searchParams.get('type') || (defaultType as TType);

  const data = await request<{ names: string[] }>(
    `${baseUrl}/${race}/?count=${count}&nameType=${type}`
  );
  return new Response(JSON.stringify(data?.names || []));
};
