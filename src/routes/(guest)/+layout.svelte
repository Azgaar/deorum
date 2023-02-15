<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { Role } from '$lib/config';

  import type { ILink } from '$lib/types/components.types';

  const linksMap = {
    signin: { id: 'signin', key: 'common.auth.signin', to: '/signin' },
    signup: { id: 'signup', key: 'common.auth.signup', to: '/signup' },
    logout: { id: 'logout', key: 'common.auth.logout', to: '/logout' },
    gallery: { id: 'gallery', key: 'common.navigation.gallery', to: '/gallery' },
    myCharacters: {
      id: 'myCharacters',
      key: 'common.navigation.myCharacters',
      to: '/my-characters'
    },
    donate: { id: 'donate', key: 'common.navigation.donate', to: 'https://www.patreon.com/azgaar' },
    admin: { id: 'admin', key: 'common.navigation.admin', to: '/admin' }
  };

  const getNavLinks = (role: Role): ILink[] => {
    const { signin, signup, logout, gallery, myCharacters, donate, admin } = linksMap;
    if (role === Role.ADMIN) return [gallery, myCharacters, donate, admin, logout];
    if (role === Role.USER) return [gallery, myCharacters, donate, logout];
    return [gallery, myCharacters, donate, signup, signin]; // Role.GUEST
  };

  $: links = getNavLinks($page.data.role);
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

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
