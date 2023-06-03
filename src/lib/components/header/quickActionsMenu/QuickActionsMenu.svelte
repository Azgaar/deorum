<script lang="ts">
  import { page } from '$app/stores';
  import { galleryNextId } from '$lib/stores';
  import { fade } from 'svelte/transition';
  import Link from '../Link.svelte';
  import { getLinks, getLinkKey } from '../navlinks';

  $: links = getLinks('quickAccess', $page, $galleryNextId);
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
    ul {
      padding: 0;

      display: flex;
      align-items: center;
      gap: 8px;

      li {
        list-style: none;
      }
    }
  }
</style>
