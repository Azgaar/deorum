<script lang="ts">
  export let ariaLabel: string | undefined = undefined;
</script>

<table class="d-table" aria-label={ariaLabel}>
  <slot />
</table>

<style lang="scss">
  table {
    min-width: 100%;
    border: 0;
    white-space: nowrap;
    border-spacing: 0;
    table-layout: fixed;

    background-color: $surface;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.12);
  }
</style>
