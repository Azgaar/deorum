<script lang="ts">
  import { page } from '$app/stores';
  import { likes } from '$lib/stores';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { Role } from '$lib/config';

  import type { ILink } from '$lib/types/components.types';

  const getNavLinks = (role: Role, likesCount: number): ILink[] => {
    const signin = { id: 'signin', key: 'common.auth.signin', to: '/signin' };
    const signup = { id: 'signup', key: 'common.auth.signup', to: '/signup' };
    const logout = { id: 'logout', key: 'common.auth.logout', to: '/logout' };
    const gallery = { id: 'gallery', key: 'common.navigation.gallery', to: '/gallery' };
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

  $: links = getNavLinks($page.data.role, likes.count($likes));
</script>

<div class="root" lang={$page.data.lang}>
  <Header {links} />
  <slot />
  <Footer />
</div>

<style lang="scss">
  div.root {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.webp');
    background-size: cover;
    background-position: center;

    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 'header' 'main' 'footer';
  }
</style>
