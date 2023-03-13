<script lang="ts">
  import { page } from '$app/stores';
  import { likes } from '$lib/stores';
  import { Role } from '$lib/config';
  import MediaQuery from '$lib/components/mediaQuery/MediaQuery.svelte';
  import NavbarMobile from './NavbarMobile.svelte';
  import NavbarDesktop from './NavbarDesktop.svelte';
  import type { ILink } from '$lib/types/components.types';

  const getNavLinks = ({
    role,
    currentId,
    routeId,
    likesCount
  }: {
    role: Role;
    currentId: string;
    routeId: string | null;
    likesCount: number;
  }): ILink[] => {
    const signin = { id: 'signin', key: 'common.auth.signin', to: '/signin' };
    const signup = { id: 'signup', key: 'common.auth.signup', to: '/signup' };
    const logout = { id: 'logout', key: 'common.auth.logout', to: '/logout' };
    const gallery = {
      id: 'gallery',
      key: 'common.navigation.gallery',
      to: `/gallery/${routeId === '/(guest)/(characters)/[slug]' ? currentId : ''}`,
      reload: true
    };
    const myCharacters = {
      id: 'myCharacters',
      key: 'common.navigation.myCharacters',
      variable: likesCount,
      to: '/my-characters'
    };
    const donate = {
      id: 'donate',
      key: 'common.navigation.donate',
      to: 'https://www.patreon.com/azgaar'
    };
    const admin = { id: 'admin', key: 'common.navigation.admin', to: '/admin' };

    if (role === Role.ADMIN) return [gallery, myCharacters, donate, admin, logout];
    if (role === Role.USER) return [gallery, myCharacters, donate, logout];
    if (role === Role.GUEST) return [gallery, donate, signup, signin];
    throw new Error('Unknown role');
  };

  $: links = getNavLinks({
    role: $page.data.role,
    currentId: $page.data.currentId,
    routeId: $page.route.id,
    likesCount: likes.count($likes)
  });
</script>

<MediaQuery query="(max-width: 599px)" let:matches>
  {#if matches}
    <NavbarMobile {links} />
  {:else}
    <NavbarDesktop {links} />
  {/if}
</MediaQuery>
