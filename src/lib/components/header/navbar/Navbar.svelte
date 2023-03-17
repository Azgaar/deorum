<script lang="ts">
  import MediaQuery from '$lib/components/mediaQuery/MediaQuery.svelte';
  import NavbarMobile from './NavbarMobile.svelte';
  import NavbarDesktop from './NavbarDesktop.svelte';
  import type { ILink } from '$lib/types/components.types';

  export let links: ILink[];
</script>

<MediaQuery query="(max-width: 599px)" let:matches>
  {#if matches}
    <NavbarMobile {links} />
  {:else}
    <NavbarDesktop {links} />
  {/if}
</MediaQuery>
