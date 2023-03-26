<script lang="ts">
  export let onClick: VoidFunction;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style lang="scss">
  @use 'sass:color';

  button {
    padding: 0;
    outline: none;
    border: none;
    background: none;
    color: $text;
    cursor: pointer;
    border-radius: 20px;

    display: flex;
    justify-content: center;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background: color.adjust($on-surface, $alpha: -0.1);
    }
  }
</style>
