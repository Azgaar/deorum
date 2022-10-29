<script lang="ts">
  export let variant: 'primary';
  export let label: string;
  export let onClick: (event: MouseEvent) => void;
</script>

<button class={variant} on:click={onClick}>
  {label}
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
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%),
      0px 1px 5px 0px rgb(0 0 0 / 12%);

    color: $text;
    font-size: 0.8em;
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }

  button.primary {
    background-color: $primary;
  }

  button.primary:hover {
    background-color: color.adjust($primary, $lightness: -5%);
  }

  button:active {
    background-color: color.adjust($primary, $lightness: -10%);
  }
</style>
