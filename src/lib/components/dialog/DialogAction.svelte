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
  .action-button {
    padding: 0;
    border: none;
    background: none;

    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    color: rgb($text, 0.85);
    transition: color 0.2s ease-in-out;

    &:hover {
      color: $text;
    }

    &:active {
      background: $text;
    }

    &:disabled {
      pointer-events: none;
      color: rgb($text, 0.2);
    }
  }
</style>
