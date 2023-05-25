<script lang="ts">
  import { page } from '$app/stores';
  import { getCoinsDialog } from '$lib/components/dialog/dialogs';
  import { t } from '$lib/locales/translations';
  import { galleryNextId } from '$lib/stores';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navlinks';

  export let isOpen: boolean;
  const toggleMenu = () => (isOpen = !isOpen);

  $: links = getLinks($page, $galleryNextId);
</script>

<aside class:isOpen on:click={toggleMenu} on:keydown={toggleMenu}>
  <menu>
    <hr />

    <section>
      <button on:click={() => getCoinsDialog($page.data.coins)}
        >{$t('common.coins.getCoins')}</button
      >
    </section>

    <hr />

    <nav>
      {#each links as link (getLinkKey(link))}
        <Link {link} />
      {/each}
    </nav>
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
    flex-direction: column;
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
      margin-top: 24px;

      min-width: calc($asideWidth - 16px * 2);
      @media ($mobile) {
        min-width: calc($asideWidthMobile - 16px * 2);
      }

      display: flex;
      flex-direction: column;
      gap: 4px;

      section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        button {
          color: $text;
          background: none;
          border: none;
          border-radius: 24px;
          transition: all 0.2s ease-in-out;
          padding: 8px 24px;
          font-size: 16px;
          cursor: pointer;

          &:hover {
            background: color.adjust($text, $alpha: -0.85);
          }
        }
      }

      hr {
        width: 100%;
        height: 1px;
        border: none;
        background-color: rgba(white, 0.04);
      }

      nav {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
    }
  }
</style>
