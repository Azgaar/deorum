<script lang="ts">
  import { page } from '$app/stores';
  import { galleryId } from '$lib/stores';
  import { fade } from 'svelte/transition';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navlinks';

  $: links = getLinks('quickAccess', $page, $galleryId);
</script>

<nav transition:fade>
  <ul>
    {#each links as link (getLinkKey(link))}
      <li><Link {link} /></li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  @use 'sass:color';

  nav {
    @media ($mobile) {
      display: none;
    }

    ul {
      padding: 0;
      gap: 8px;

      display: flex;
      align-items: center;

      li {
        list-style: none;
      }
    }
  }
</style>
