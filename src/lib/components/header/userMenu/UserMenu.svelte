<script lang="ts">
  import Coins from './Coins.svelte';
  import MenuContent from './MenuContent.svelte';
  import Wreath from './Wreath.svelte';

  let isOpen = false;
  const toggleMenu = () => (isOpen = !isOpen);
</script>

<div class="backdrop" class:isOpen on:click={toggleMenu} on:keydown={toggleMenu} />

<MenuContent bind:isOpen />

<button class="userMenuButton" class:isOpen on:click={() => (isOpen = !isOpen)}>
  <Wreath />
  <div class="menuIcon">☰</div>
  <Coins />
</button>

<style lang="scss">
  @use 'sass:color';

  .userMenuButton {
    position: relative;
    background: none;
    border: 0;
    padding: 8px;
    cursor: pointer;
    z-index: 2;

    transition: 0.5s;
    right: 0px;
    bottom: 6px;

    display: flex;
    align-items: center;
    justify-content: center;

    .menuIcon {
      border-radius: 50%;
      color: $text;
      font-size: 26px;
      line-height: 1.4;
      background-color: color.adjust($primary, $alpha: -0.8);
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
