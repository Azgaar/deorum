<script lang="ts">
  export let checked: boolean = false;
  export let onChange: ((e: Event) => void) | undefined = undefined;
  export let name: string = '';
  export let disabled: boolean = false;
</script>

<input type="checkbox" {checked} {name} {disabled} on:change={onChange} />

<style lang="scss">
  input {
    position: relative;
    appearance: none;
    width: 18px;
    height: 18px;

    border-width: 2px;
    border-style: solid;
    border-radius: 2px;

    transition: all 0.1s ease-in-out;
    background: transparent;
    border-color: var(--checkbox-border-color, rgba(255, 255, 255, 0.54));
  }

  input::after {
    position: absolute;
    top: 2px;
    left: 1px;
    content: '';
    width: 10px;
    height: 5px;

    border: 1.5px solid white;
    border-width: 2px;
    border-right: none;
    border-top: none;
    transform: rotate(-45deg);

    opacity: 0;
    visibility: hidden;
    transition: all 0.1s ease-in-out;
    transition-delay: 0.05s;
  }

  input:checked {
    background-color: var(--checkbox-background-color, $secondary);
    border-color: transparent;

    &::after {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
