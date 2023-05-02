<script lang="ts">
  import { page } from '$app/stores';
  import { galleryNextId } from '$lib/stores';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navbar/navlinks';

  export let isOpen: boolean;
  const toggleMenu = () => (isOpen = !isOpen);

  $: links = getLinks($page, $galleryNextId);
</script>

<aside class:isOpen on:click={toggleMenu} on:keydown={toggleMenu}>
  <menu>
    {#each links as link (getLinkKey(link))}
      <li><Link {link} /></li>
    {/each}
  </menu>
</aside>

<style lang="scss">
  @use 'sass:color';
  $asideWidth: 220px;
  $asideWidthMobile: 180px;

  aside {
    position: absolute;
    overflow: hidden;

    right: 0;
    bottom: 0;
    height: 100%;
    background-image: linear-gradient(135deg, rgba(12, 2, 1, 1), rgba(32, 10, 2, 0.9));
    z-index: 1;

    display: flex;
    transition: 0.5s;
    width: 0;

    &.isOpen {
      width: $asideWidth;

      @media ($mobile) {
        width: $asideWidthMobile;
      }
    }

    menu {
      padding: 16px;
      margin-top: 48px;
      list-style: none;

      min-width: calc($asideWidth - 16px * 2);
      @media ($mobile) {
        min-width: calc($asideWidthMobile - 16px * 2);
      }

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }
  }
</style>
