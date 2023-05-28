<div class="dialog-body">
  <slot />
</div>

<style lang="scss">
  .dialog-body {
    font-size: 14px;
    color: $text;
    line-height: 1;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
