<script lang="ts">
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import Navbar from './navbar/Navbar.svelte';
  import type { ILink } from '$lib/types/components.types';

  export let links: ILink[];
</script>

<header>
  <TextLogo size={42} />
  <Navbar {links} />
</header>

<style lang="scss">
  @use 'sass:color';

  header {
    height: 48px;
    background-color: color.adjust(black, $alpha: -0.8);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;

    @media ($mobile) {
      padding: 0 8px;
      font-size: small;
    }
  }
</style>
