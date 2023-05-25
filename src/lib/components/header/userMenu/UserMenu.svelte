<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/locales/translations';
  import Coins from './Coins.svelte';
  import MenuContent from './MenuContent.svelte';
  import Wreath from './Wreath.svelte';

  let isOpen = false;
  const toggleMenu = () => (isOpen = !isOpen);
</script>

<div class="backdrop" class:isOpen on:click={toggleMenu} on:keydown={toggleMenu} />

<MenuContent bind:isOpen />

<div class="userMenu">
  <div class="userDetails" class:isOpen>
    <div>{$page.data.name}</div>
    <div>{$t('common.coins.coinsLeft', { variable: $page.data.coins })}</div>
  </div>

  <button class="userMenuButton" on:click={() => (isOpen = !isOpen)}>
    <Wreath />
    <div class="menuIcon">☰</div>
    <Coins />
  </button>
</div>

<style lang="scss">
  @use 'sass:color';

  .userMenu {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2;

    .userDetails {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: small;

      transition: 0.3s ease-in;
      opacity: 0;

      &.isOpen {
        opacity: 1;
      }
    }

    .userMenuButton {
      position: relative;
      background: none;
      border: 0;
      padding: 8px;
      cursor: pointer;
      z-index: 2;

      right: 0px;
      bottom: 6px;

      display: flex;
      align-items: center;
      justify-content: center;

      .menuIcon {
        border-radius: 50%;
        font-size: 26px;
        line-height: 1.4;
        background-color: color.adjust($primary, $alpha: -0.8);
        user-select: none;
      }

      color: rgba($text, 0.9);
      transition: all 0.3s;

      &:hover {
        color: $text;
      }
    }
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background-color: color.adjust(black, $alpha: -0.8);
    z-index: 1;

    transition: 0.5s;
    opacity: 0;
    visibility: hidden;

    &.isOpen {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
