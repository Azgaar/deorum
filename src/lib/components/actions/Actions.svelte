<script>
  import { fade } from 'svelte/transition';
</script>

<div class="actions noprint" transition:fade>
  <div class="pane top">
    <slot name="top" />
  </div>

  <div class="pane bottom">
    <slot name="bottom" />
  </div>
</div>

<style lang="scss">
  @use 'sass:color';

  div.actions {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;

    div.pane {
      position: absolute;

      border-radius: 20px;
      background: color.adjust($on-surface, $alpha: -0.6);
      display: flex;
      gap: 4px;

      &.top {
        top: 0.5rem;
        right: 0.5rem;
      }

      &.bottom {
        bottom: 0.5rem;
        right: 0.5rem;
      }
    }
  }
</style>
