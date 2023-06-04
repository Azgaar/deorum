<script lang="ts">
  export let onClick: VoidFunction;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style lang="scss">
  @use 'sass:color';

  button {
    color: $text;
    background: none;
    border: none;
    border-radius: 24px;
    transition: all 0.2s ease-in-out;

    font-size: inherit;
    padding: 8px 24px;

    @media ($mobile) {
      padding: 6px 12px;
    }

    cursor: pointer;

    &:hover {
      background: color.adjust($text, $alpha: -0.85);
    }
  }
</style>
