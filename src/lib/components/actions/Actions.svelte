<script>
  import { fade } from 'svelte/transition';
</script>

<div class="actions noprint" transition:fade>
  <div class="pane top left">
    <slot name="top-left" />
  </div>

  <div class="pane top right">
    <slot name="top-right" />
  </div>

  <div class="pane bottom left">
    <slot name="bottom-left" />
  </div>

  <div class="pane bottom right">
    <slot name="bottom-right" />
  </div>
</div>

<style lang="scss">
  div.actions {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;

    div.pane {
      position: absolute;

      border-radius: 20px;
      background: rgb($on-surface, 0.4);
      display: flex;
      gap: 2px;

      &.top {
        top: 0.5rem;
      }

      &.right {
        right: 0.5rem;
      }

      &.bottom {
        bottom: 0.65rem;
      }

      &.left {
        left: 0.5rem;
      }
    }
  }
</style>
