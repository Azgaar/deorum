<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<main aria-label="library layout" transition:fade>
  <slot />
</main>

<style lang="scss">
  main {
    height: 100%;
    align-items: center;
    overflow-y: auto;
  }
</style>
