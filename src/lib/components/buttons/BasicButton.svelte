<script lang="ts">
  export let variant: 'primary' | 'text' = 'primary';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick: ((event: MouseEvent) => void) | undefined = undefined;
  export let href: string | undefined = undefined;
  export let disabled = false;
  export let style: string | undefined = undefined;
</script>

{#if href}
  <a
    {href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener' : undefined}
  >
    <button {type} {disabled} {style} class={variant}>
      <slot />
    </button>
  </a>
{:else}
  <button {type} {disabled} {style} class={variant} on:click={onClick}>
    <slot />
  </button>
{/if}

<style lang="scss">
  @use 'sass:color';

  button {
    text-transform: uppercase;
    border: none;
    border-radius: 4px;
    height: 2em;
    padding: 0 0.8rem;
    cursor: pointer;
    user-select: none;

    color: rgb($text, 0.9);
    font-size: 0.8em;
    opacity: 1;
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;

    &.primary {
      width: 100%;
      height: 36px;
      font-size: 0.875rem;
      font-weight: 300;
      letter-spacing: 0.09em;
      background-color: $primary;
      box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%),
        0px 1px 5px 0px rgb(0 0 0 / 12%);

      &:hover {
        background-color: color.scale($primary, $lightness: 5%);
      }

      &:active {
        background-color: color.adjust($primary, $lightness: -10%);
      }

      &:disabled {
        background-color: rgb($text, 0.1);
        color: rgb($text, 0.4);
        pointer-events: none;
      }
    }

    &.text {
      background-color: transparent;
      border: none;

      &:hover {
        color: $text;
      }

      &:disabled {
        color: rgb($text, 0.4);
        pointer-events: none;
      }
    }
  }
</style>
