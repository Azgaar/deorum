{#if $$slots}
  <div class="dialog-footer">
    <slot />
  </div>
{/if}

<style lang="scss">
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    margin-right: -16px;
  }
</style>
