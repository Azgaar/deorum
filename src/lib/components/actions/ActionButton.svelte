<script lang="ts">
  import { tooltip } from '$lib/scripts/tooltip';

  export let onClick: VoidFunction | null = null;
  export let href: string | null = null;
  export let isActive = false;
  export let title = '';
</script>

{#if onClick}
  <button on:click={onClick} class:isActive use:tooltip {title}>
    <slot />
  </button>
{:else if href}
  <a data-sveltekit-preload-data="hover" {href} class:isActive use:tooltip {title}>
    <slot />
  </a>
{/if}

<style lang="scss">
  @use 'sass:color';

  button,
  a {
    padding: 0;
    outline: none;
    border: none;
    background: none;
    color: $text;
    cursor: pointer;
    border-radius: 20px;
    text-decoration: none;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background: color.adjust($on-surface, $alpha: -0.1);
    }

    &.isActive {
      background: color.adjust($on-surface, $alpha: -0.2);
    }
  }
</style>
