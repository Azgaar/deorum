{#if $$slots}
  <div class="dialog-footer">
    <slot />
  </div>
{/if}

<style lang="scss">
  .dialog-footer {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2em;
  }
</style>
