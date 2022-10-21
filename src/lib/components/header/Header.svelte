<script lang="ts">
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import type { ILink } from '$lib/types/components.types';
  import Link from './Link.svelte';

  export let links: ILink[] = [];
</script>

<header>
  <TextLogo size={42} />

  <nav>
    <ul>
      {#each links as link (link.key)}
        <li>
          <Link {link} />
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style lang="scss">
  @use 'sass:color';

  header {
    height: 65px;
    background-color: color.adjust(black, $alpha: -0.8);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;

    @media screen and (max-width: 599px) {
      padding: 0 8px;
      font-size: small;
    }

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
  }
</style>
