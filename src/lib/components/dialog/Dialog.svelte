<script lang="ts">
  import { fly } from 'svelte/transition';

  export let isOpen: boolean;
  export let onClickOutside: VoidFunction | null = null;
</script>

<template>
  {#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <dialog
      aria-labelledby="dialog-title"
      class="dialog-wrapper"
      on:click={onClickOutside}
      in:fly={{ x: 0, duration: 200 }}
      out:fly={{ x: 0, duration: 200 }}
    >
      <div
        class="dialog-container"
        on:click|stopPropagation
        in:fly={{ y: -100, duration: 300 }}
        out:fly={{ y: 0, duration: 300 }}
      >
        <slot />
      </div>
    </dialog>
  {/if}
</template>

<style lang="scss">
  .dialog-wrapper {
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;

    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-container {
      padding: 20px 20px 14px;
      max-width: min(600px, 80vw);
      min-width: 340px;
      box-sizing: border-box;

      background-color: $surface;
      border-radius: 5px;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);

      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
