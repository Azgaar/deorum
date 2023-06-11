<script lang="ts">
  import { page } from '$app/stores';
  import { openGetCoinsDialog } from '$lib/components/dialog/provider';
  import { t } from '$lib/locales/translations';
  import { galleryId } from '$lib/stores';
  import Button from '../Button.svelte';
  import Link from '../Link.svelte';
  import { getLinkKey, getLinks } from '../navlinks';

  export let isOpen: boolean;
  const toggleMenu = () => (isOpen = !isOpen);

  $: links = getLinks('sidebar', $page, $galleryId);
</script>

<aside class:isOpen on:click={toggleMenu} on:keydown={toggleMenu}>
  <div class="userDetails" class:isOpen>
    <div>
      <div>{$page.data.name}</div>
      <div>{$t('common.coins.coinsLeft', { variable: $page.data.coins })}</div>
    </div>
  </div>

  <menu>
    <section>
      <Button onClick={() => openGetCoinsDialog($page.data.coins)}>
        {$t('common.coins.getCoins')}
      </Button>
    </section>

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
    background-image: linear-gradient(135deg, rgb(12, 2, 1), rgb(32, 10, 2, 0.9));
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

    .userDetails {
      height: 48px;
      border-bottom: 1px solid rgb($text, 0.04);

      &:not(.isOpen) {
        opacity: 0;
        visibility: hidden;

        transition: 0.1s ease-in;
      }

      &.isOpen {
        opacity: 1;
        visibility: visible;

        transition: 0.2s ease-in;
        transition-delay: 0.3s;
      }

      display: flex;
      align-items: center;
      justify-content: flex-end;

      div {
        margin-right: 82px;
        width: 120px;

        @media ($mobile) {
          margin-right: 58px;
          width: 110px;
        }

        overflow: hidden;
        white-space: nowrap;

        font-size: small;
        text-align: right;
        div {
          text-overflow: ellipsis;
        }
      }
    }

    menu {
      padding: 0 16px;

      min-width: calc($asideWidth - 16px * 2);
      @media ($mobile) {
        min-width: calc($asideWidthMobile - 16px * 2);
      }

      display: flex;
      flex-direction: column;
      gap: 8px;

      section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      nav {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-align: center;
      }
    }
  }
</style>
