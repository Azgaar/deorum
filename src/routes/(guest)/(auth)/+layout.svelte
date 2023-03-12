<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<main aria-label="auth layout" transition:fade>
  <slot />
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    grid-area: main;
    align-self: center;
    justify-self: center;
    background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
  }
</style>
