<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<main aria-label="custom character layout" transition:fade>
  <slot />
</main>

<style lang="scss">
  main {
    height: 100%;
    align-items: center;
    overflow-y: auto;
  }
</style>
