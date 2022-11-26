<script lang="ts">
  export let variant: 'primary' | 'text' = 'primary';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick = (event: MouseEvent) => {};
  export let disabled = false;
  export let style = '';
</script>

<button {type} {disabled} {style} class={variant} on:click={onClick}>
  <slot />
</button>

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

    color: color.adjust($text, $lightness: -10%);
    font-size: 0.8em;
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }

  button.primary {
    background-color: $primary;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%),
      0px 1px 5px 0px rgb(0 0 0 / 12%);

    &:hover {
      background-color: color.scale($primary, $lightness: 5%);
    }

    &:active {
      background-color: color.adjust($primary, $lightness: -10%);
    }
  }

  button.text {
    background-color: transparent;
    border: none;

    &:hover {
      color: $text;
    }
  }
</style>
