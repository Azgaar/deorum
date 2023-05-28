{#if $$slots}
  <div class="dialog-footer">
    <slot />
  </div>
{/if}

<style lang="scss">
  .dialog-footer {
    position: relative;
    margin-right: -16px;

    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
