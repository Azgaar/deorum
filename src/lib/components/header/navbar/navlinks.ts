import type { Page } from '@sveltejs/kit';
import type { ILink } from '$lib/types/components.types';
import { Role } from '$lib/config';

type TNavlinksData = {
  routeId?: string;
  role?: Role;
  currentId?: string;
  galleryNextId: string | null;
  randomId?: string;
  nextId?: string;
};

// prettier-ignore
const linkGenerators: {[key: string]: (data: TNavlinksData) => ILink[]} = {
  '/admin/portraits/statistics': () => [
    { id: 'originals', key: 'admin.editor.originals', to: './originals' },
    { id: 'tags', key: 'admin.editor.tags', to: './tags' },
    { id: 'styles', key: 'admin.editor.styles', to: './styles' },
    { id: 'colors', key: 'admin.editor.colors', to: './colors' },
    { id: 'quality', key: 'admin.editor.quality', to: './quality' },
    { id: 'back', key: 'common.controls.back', to: '/admin/portraits' }
  ],
  '/admin/characters/statistics': () => [
    { id: 'races', key: 'admin.statistics.races', to: './races' },
    { id: 'genders', key: 'admin.statistics.genders', to: './genders' },
    { id: 'archetypes', key: 'admin.statistics.archetypes', to: './archetypes' },
    { id: 'backgrounds', key: 'admin.statistics.backgrounds', to: './backgrounds' },
    { id: 'cancel', key: 'common.controls.back', to: '/admin/characters' }
  ],
  '/(user)/match': (data) => [
    { id: 'tags', key: 'common.navigation.tags', to: `/match/tags/${data.currentId}` },
    { id: 'next', key: 'common.navigation.next', to: `./${data.nextId}` }
  ],
  'default': (data) => [
    { id: 'gallery', key: 'common.navigation.gallery', to: getGalleryNextId(data), reload: true },
    { id: `myCharacters`, key: 'common.navigation.myCharacters', to: '/myCharacters' },
    { id: 'match', key: 'common.navigation.match', to: '/match', roles: [Role.ADMIN] },
    { id: 'donate', key: 'common.navigation.donate', to: 'https://www.patreon.com/azgaar', roles: [Role.GUEST, Role.USER] },
    { id: 'admin', key: 'common.navigation.admin', to: '/admin/portraits', roles: [Role.ADMIN] }
  ],
};

const commonLinks = [
  { id: 'signin', key: 'common.auth.signin', to: '/signin', roles: [Role.GUEST] },
  { id: 'signup', key: 'common.auth.signup', to: '/signup', roles: [Role.GUEST] },
  { id: 'logout', key: 'common.auth.logout', to: '/logout', roles: [Role.USER, Role.ADMIN] }
];

function getGalleryNextId({ routeId, currentId, galleryNextId, randomId }: TNavlinksData) {
  if (routeId === '/(guest)/(characters)/[slug]') return `/gallery/${currentId}`;
  if (galleryNextId) return `/gallery/${galleryNextId}`;
  if (randomId) return `/gallery/${randomId}`;
  return '/gallery';
}

const match = (routeId: string) => {
  const keys = Object.keys(linkGenerators);
  const match = keys.find((key) => routeId.startsWith(key)) || 'default';
  return linkGenerators[match];
};

export const getLinks = (
  page: Page<Record<string, string>, string | null>,
  galleryNextId: string | null
) => {
  const routeId = page.route.id;
  if (!routeId) return [];

  const { role, currentId, randomId, nextId } = page.data;
  const linksData = { routeId, role, currentId, randomId, nextId, galleryNextId };

  const routeLinks = match(routeId)(linksData);
  const combinedLinks = [...routeLinks, ...commonLinks];
  const filteredLinks = combinedLinks.filter(({ roles }) => !roles || roles.includes(role));

  return filteredLinks;
};

export const getLinkKey = (link: ILink) => Object.values(link).join('-');
