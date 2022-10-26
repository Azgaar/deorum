<script lang="ts" context="module">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import { language } from '$lib/stores';
  import { role, Role } from '$lib/stores';

  import type { ILink } from '$lib/types/components.types';

  const linksMap: { [key: string]: ILink } = {
    signin: { id: 'signin', key: 'common.auth.signin', to: '/signin' },
    signup: { id: 'signup', key: 'common.auth.signup', to: '/signup' },
    logout: { id: 'logout', key: 'common.auth.logout', to: '/logout' },
    match: { id: 'match', key: 'common.navigation.match', to: '/match' },
    admin: { id: 'admin', key: 'common.navigation.admin', to: '/admin' }
  };

  const getNavLinks = (role: Role): ILink[] => {
    const { signin, signup, logout, match, admin } = linksMap;
    if (role === Role.ADMIN) return [match, admin, logout];
    if (role === Role.USER) return [match, logout];
    return [signin, signup]; // Role.GUEST
  };
</script>

<div class="root" lang={$language}>
  <Header links={getNavLinks($role)} />

  <main>
    <slot />
  </main>

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

    main {
      height: 100%;

      display: grid;
      grid-template-rows: 1fr 64px;
      align-items: center;
      justify-content: center;
      padding: 0 32px;
    }
  }
</style>
