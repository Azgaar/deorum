<script lang="ts">
  import Book from '../Book.svelte';
  import Link from '../Link.svelte';
  import type { ILink } from '$lib/types/components.types';

  export let links: ILink[];

  let collapsed = true;
  const toggleMenu = () => (collapsed = !collapsed);
</script>

<nav>
  <div class="backdrop" class:collapsed on:click={toggleMenu} />
  <button class="menu" on:click={toggleMenu}>☰</button>
  <aside class:collapsed on:click={toggleMenu}>
    <ul>
      {#each links as link (`${link.key}-${link.variable}`)}
        <li>
          <Link {link} />
        </li>
      {/each}
    </ul>
    <Book />
  </aside>
</nav>

<style lang="scss">
  @use 'sass:color';
  $height: 48px;
  $asideWidth: 220px;

  nav {
    button.menu {
      background: none;
      border: 0;

      color: $text;
      font-size: 30px;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      background-color: color.adjust(black, $alpha: -0.8);

      transition: 0.5s;
      opacity: 1;
      visibility: visible;
    }

    .backdrop.collapsed {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    aside {
      position: absolute;
      overflow: hidden;

      top: $height;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(135deg, rgba(12, 2, 1, 1), rgba(32, 10, 2, 0.9));
      z-index: 1;

      display: flex;
      transition: 0.5s;
      width: $asideWidth;

      ul {
        padding: 16px;
        min-width: calc($asideWidth - 16px * 2);
        list-style: none;
        margin: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        li {
          white-space: nowrap;
        }
      }
    }

    aside.collapsed {
      width: 0;
    }
  }
</style>
