<script lang="ts">
  import { page } from '$app/stores';
  import { dialog } from '$lib/components/dialog/dialog';
  import { PATREON_COIN_PRICE_USD, REGISTRATION_BONUS } from '$lib/config/coins';
  import { t } from '$lib/locales/translations';
  import { galleryNextId } from '$lib/stores';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navlinks';

  export let isOpen: boolean;
  const toggleMenu = () => (isOpen = !isOpen);

  $: links = getLinks($page, $galleryNextId);

  const openGetCoinsDialog = () => {
    dialog.open({
      title: $t('common.userMenu.getCoins'),
      body: `
        <p>${$t('common.userMenu.description.1', { variable: REGISTRATION_BONUS })}</p>
        <p>${$t('common.userMenu.description.2')}</p>
        <p>${$t('common.userMenu.description.3', { variable: PATREON_COIN_PRICE_USD })}</p>
        <p>${$t('common.userMenu.description.4')}</p>
      `,
      confirmButton: $t('common.userMenu.openPatreon'),
      onConfirm: () => window.open('https://www.patreon.com/azgaar', '_blank'),
      cancelButton: $t('common.controls.close')
    });
  };
</script>

<aside class:isOpen on:click={toggleMenu} on:keydown={toggleMenu}>
  <menu>
    <hr />

    <section>
      <button on:click={openGetCoinsDialog}>{$t('common.userMenu.getCoins')}</button>
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
