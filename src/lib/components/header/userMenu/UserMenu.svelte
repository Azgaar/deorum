<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/locales/translations';
  import Coins from './Coins.svelte';
  import MenuContent from './MenuContent.svelte';
  import Wreath from './Wreath.svelte';

  let isOpen = false;
  const toggleMenu = () => (isOpen = !isOpen);
</script>

<div>
  <div class="backdrop" class:isOpen on:click={toggleMenu} on:keydown={toggleMenu} />

  <MenuContent bind:isOpen />

  <button class="userMenuButton" on:click={() => (isOpen = !isOpen)}>
    <Wreath />
    <div class="menuIcon">☰</div>
    <Coins />
  </button>
</div>

<style lang="scss">
  .userMenuButton {
    position: relative;
    background: none;
    border: 0;
    padding: 8px;
    margin-bottom: 8px;
    margin-left: 8px;
    z-index: 2;
    cursor: pointer;

    @media ($mobile) {
      margin-left: 0;
    }

    display: flex;
    justify-content: center;

    .menuIcon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 26px;
      line-height: 1;
      background-color: rgb($primary, 0.2);
      user-select: none;
    }

    color: rgb($text, 0.9);
    transition: all 0.3s;

    &:hover {
      color: $text;
    }
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background-color: rgb(black, 0.2);
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
