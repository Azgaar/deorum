<script lang="ts">
  export let onClick: VoidFunction;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style lang="scss">
  button {
    color: $text;
    background: none;
    border: none;
    border-radius: 24px;
    transition: all 0.3s ease-in-out;

    font-size: inherit;
    padding: 8px 24px;

    @media ($mobile) {
      padding: 6px 12px;
    }

    cursor: pointer;

    &:hover {
      background: rgb($text, 0.15);
    }
  }
</style>
