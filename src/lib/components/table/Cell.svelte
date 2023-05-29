<script lang="ts">
  export let style: string | undefined = undefined;
</script>

<td {style}>
  <slot />
</td>

<style lang="scss">
  td {
    padding: 0 16px;

    font-size: 0.875rem;
    line-height: 1.375rem;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    outline: none;
    text-align: left;

    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
</style>
