<script lang="ts">
  import { page } from '$app/stores';
  import { galleryId } from '$lib/stores';
  import { fade } from 'svelte/transition';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navlinks';

  let collapsed = true;

  const toggleMenu = () => {
    console.log('toggleMenu');
    collapsed = !collapsed;
  };

  $: links = getLinks('sidebar', $page, $galleryId);
</script>

<nav in:fade>
  <div class="backdrop" class:collapsed on:click={toggleMenu} on:keydown={toggleMenu} />

  <button class="menu" on:click={toggleMenu}>☰</button>

  <aside class:collapsed on:click={toggleMenu} on:keydown={toggleMenu}>
    <ul>
      {#each links as link (getLinkKey(link))}
        <li><Link {link} /></li>
      {/each}
    </ul>
  </aside>
</nav>

<style lang="scss">
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

      @media ($mobile) {
        margin-top: -6px;
      }
    }

    .backdrop {
      position: absolute;
      inset: 0;
      z-index: 1;
      background-color: rgb(black, 0.2);

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
      background-image: linear-gradient(135deg, rgb(12, 2, 1), rgb(32, 10, 2, 0.9));
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
        gap: 18px;

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
