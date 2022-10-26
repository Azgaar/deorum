<div>
  <slot />
</div>

<style lang="scss">
  @use 'sass:color';

  div {
    padding: 16px 0px;
    background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
  }
</style>
