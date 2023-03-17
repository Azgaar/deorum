<script lang="ts">
  export let onClick: VoidFunction;
  export let disabled = false;
</script>

<button type="button" {disabled} on:click={onClick}>
  <slot />
</button>

<style lang="scss">
  button {
    border: none;
    color: $text;
    cursor: pointer;

    background: rgba($secondary, 0.5);
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
