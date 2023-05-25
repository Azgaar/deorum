<script lang="ts">
  import { tooltip } from '$lib/scripts/tooltip';
  import { noop } from 'svelte/internal';

  export let onClick = noop;
  export let disabled = false;
  export let title = '';
</script>

{#if title}
  <button type="button" {disabled} on:click={onClick} {title} use:tooltip>
    <slot />
  </button>
{:else}
  <button type="button" {disabled} on:click={onClick}>
    <slot />
  </button>
{/if}

<style lang="scss">
  button {
    border: none;
    color: $text;
    cursor: pointer;

    background: rgba($secondary, 0.6);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;

    display: flex;
    font-size: 1rem;
    width: 23px;
    height: 23px;
    justify-content: center;
    align-items: center;
  }

  button[disabled] {
    cursor: wait;
  }

  button:hover {
    background: rgba($secondary, 0.6);
  }
</style>
