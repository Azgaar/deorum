<script lang="ts">
  import { page } from '$app/stores';
  import { galleryNextId } from '$lib/stores';
  import Link from '../Link.svelte';
  import { getLinks, getLinkKey } from './navlinks';

  $: links = getLinks($page, $galleryNextId);
</script>

<nav>
  <ul>
    {#each links as link (getLinkKey(link))}
      <li><Link {link} /></li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  ul {
    padding: 0;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;

    li {
      list-style: none;
      text-align: center;
    }
  }
</style>
