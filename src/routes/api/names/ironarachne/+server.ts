import { json } from '@sveltejs/kit';
import { request } from '$lib/utils/requests';
import type { RequestHandler } from './$types';

const baseUrl = 'https://muna.ironarachne.com';
const defaultRace = 'human';
const defaultType = 'male';

const supportedRaces = [
  'dragonborn',
  'dwarf',
  'elf',
  'gnome',
  'goblin',
  'halfling',
  'halfelf',
  'halforc',
  'human',
  'orc',
  'tiefling',
  'troll'
];
const supportedTypes = ['male', 'female', 'family'];

export const GET: RequestHandler = async ({ url }) => {
  const count = Number(url.searchParams.get('quantity'));

  let race = url.searchParams.get('race');
  if (!race || !supportedRaces.includes(race)) race = defaultRace;

  let type = url.searchParams.get('type');
  if (!type || !supportedTypes.includes(type)) type = defaultType;

  const requestUrl = `${baseUrl}/${race}/?count=${count}&nameType=${type}`;
  const data = await request<{ names: string[] }>(requestUrl);
  return json(data.names || []);
};
