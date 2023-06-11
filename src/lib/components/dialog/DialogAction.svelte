<script lang="ts">
  export let handleClick: VoidFunction | null = null;
  export let type: 'button' | 'submit' = 'button';
  export let disabled = false;
</script>

{#if $$slots}
  <button {type} class="action-button" on:click={handleClick} {disabled}>
    <slot />
  </button>
{/if}

<style lang="scss">
  @use 'sass:color';

  .action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 24px;

    color: $text;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background 0.2s ease-in-out;
    background: none;

    &:hover {
      background: color.adjust($text, $alpha: -0.85);
    }

    &:active {
      background: color.adjust($text, $alpha: -0.95);
    }

    &:disabled {
      pointer-events: none;
      color: color.adjust($text, $alpha: -0.9);
    }
  }
</style>
