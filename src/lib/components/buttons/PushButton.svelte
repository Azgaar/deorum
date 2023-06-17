<script lang="ts">
  export let variant: 'green' | 'red';
  export let label: string;
  export let onClick: (event: MouseEvent) => void;
</script>

<button class={variant} class:hidden={false} on:click={onClick}>
  {label}
</button>

<style lang="scss">
  @use 'sass:color';

  button {
    text-transform: lowercase;
    border-style: solid;
    border-width: 0 0 2px 0;
    border-color: rgb(black, 0.3);
    border-radius: 2px;
    height: 1.6em;
    padding: 0 0.5rem;
    cursor: pointer;

    color: $text;
    font-size: 0.9em;
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }

  button.green {
    background-color: $success;
  }

  button.green:hover {
    background-color: color.adjust($success, $lightness: -10%);
  }

  button.red {
    background-color: $error;
  }

  button.red:hover {
    background-color: color.adjust($error, $lightness: -10%);
  }

  button:active {
    border-width: 2px 0 0 0;
  }

  button.hidden {
    pointer-events: none;
    opacity: 0;
  }
</style>
