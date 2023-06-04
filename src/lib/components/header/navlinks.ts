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
const createQuickAccessLinks: {[key: string]: (data: TNavlinksData) => ILink[]} = {
  '/admin/portraits/statistics': () => [
    { id: 'originals', key: 'admin.editor.originals', to: './originals' },
    { id: 'tags', key: 'admin.editor.tags', to: './tags' },
    { id: 'styles', key: 'admin.editor.styles', to: './styles' },
    { id: 'colors', key: 'admin.editor.colors', to: './colors' },
    { id: 'quality', key: 'admin.editor.quality', to: './quality' },
    { id: 'backToPortraits', key: 'common.controls.back', to: '/admin/portraits' }
  ],
  '/admin/characters/statistics': () => [
    { id: 'races', key: 'admin.statistics.races', to: './races' },
    { id: 'genders', key: 'admin.statistics.genders', to: './genders' },
    { id: 'archetypes', key: 'admin.statistics.archetypes', to: './archetypes' },
    { id: 'backgrounds', key: 'admin.statistics.backgrounds', to: './backgrounds' },
    { id: 'backToCharacters', key: 'common.controls.back', to: '/admin/characters' }
  ],
  '/(user)/match': (data) => [
    { id: 'tags', key: 'common.navigation.tags', to: `/match/tags/${data.currentId}` },
    { id: 'next', key: 'common.navigation.next', to: `./${data.nextId}` }
  ],
  '/(guest)/(characters)/gallery/[slug]': () => [
    { id: `library`, key: 'common.navigation.library', to: '/library' },
  ],
  '/(guest)/(characters)/[slug]': (data) => [
    { id: 'backToGallery', key: 'common.navigation.back', to: `/gallery/${data.currentId}`, reload: true },
  ],
  '/(user)/library': (data) => [
    { id: 'newGallery', key: 'common.navigation.gallery', to: getGalleryNextId(data), reload: true },
  ],
  'default': () => [
    { id: 'signin', key: 'common.auth.signin', to: '/signin', roles: [Role.GUEST] },
  ],
};

// prettier-ignore
const createSidebarLinks: {[key: string]: (data: TNavlinksData) => ILink[]} = {
  'default': (data) => [
    { id: 'gallery', key: 'common.navigation.gallery', to: getGalleryNextId(data), reload: true },
    { id: `library`, key: 'common.navigation.library', to: '/library' },
    { id: 'match', key: 'common.navigation.match', to: '/match', roles: [Role.ADMIN] },
    { id: 'terms', key: 'common.navigation.terms', to: '/terms' },
    { id: 'discord', key: 'common.navigation.discord', to: 'https://discordapp.com/invite/X7E84HU' },
    { id: 'donate', key: 'common.navigation.donate', to: 'https://www.patreon.com/azgaar', roles: [Role.GUEST, Role.USER] },
    { id: 'admin', key: 'common.navigation.admin', to: '/admin/portraits', roles: [Role.ADMIN] },
    { id: 'logout', key: 'common.auth.logout', to: '/logout', roles: [Role.USER, Role.ADMIN] }
  ],
};

function getGalleryNextId({ routeId, currentId, galleryNextId, randomId }: TNavlinksData) {
  if (routeId === '/(guest)/(characters)/[slug]') return `/gallery/${currentId}`;
  if (galleryNextId) return `/gallery/${galleryNextId}`;
  if (randomId) return `/gallery/${randomId}`;
  return '/gallery';
}

const match = (type: 'quickAccess' | 'sidebar', routeId: string) => {
  const generator = type === 'quickAccess' ? createQuickAccessLinks : createSidebarLinks;
  const match = Object.keys(generator).find((key) => routeId.startsWith(key)) || 'default';
  return generator[match];
};

export const getLinks = (
  type: 'quickAccess' | 'sidebar',
  page: Page<Record<string, string>, string | null>,
  galleryNextId: string | null
) => {
  const routeId = page.route.id;
  console.log('routeId', routeId);
  if (!routeId) return [];

  const { role, currentId, randomId, nextId } = page.data;
  const linksData = { routeId, role, currentId, randomId, nextId, galleryNextId };

  const routeLinks = match(type, routeId)(linksData);
  const filteredLinks = routeLinks.filter(({ roles }) => !roles || roles.includes(role));

  return filteredLinks;
};

export const getLinkKey = (link: ILink) => Object.values(link).join('-');
