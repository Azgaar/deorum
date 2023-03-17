<script lang="ts">
  import Link from '../Link.svelte';
  import type { ILink } from '$lib/types/components.types';

  export let links: ILink[];
  const getKey = (link: ILink) => Object.values(link).join('-');
</script>

<nav>
  <ul>
    {#each links as link (getKey(link))}
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
