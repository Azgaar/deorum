<script lang="ts">
  import MediaQuery from '$lib/components/mediaQuery/MediaQuery.svelte';
  import NavbarMobile from './NavbarMobile.svelte';
  import NavbarDesktop from './NavbarDesktop.svelte';
</script>

<MediaQuery query="(max-width: 599px)" let:matches>
  {#if matches}
    <NavbarMobile />
  {:else}
    <NavbarDesktop />
  {/if}
</MediaQuery>
