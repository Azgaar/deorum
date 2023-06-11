<script lang="ts">
  export let style: string | undefined = undefined;
  export let head = false;
</script>

<tr class:head {style}>
  <slot />
</tr>

<style lang="scss">
  tr {
    height: 56px;

    &:hover:not(.head) {
      background-color: rgb($text, 0.04);
    }
  }
</style>
