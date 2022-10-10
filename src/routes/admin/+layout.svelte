<script lang="ts" context="module">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import { language } from '$lib/stores';
</script>

<svelte:head>
  <title>Deorum Admin</title>
</svelte:head>

<div class="root" lang={$language} translate="no">
  <main>
    <slot />
    <Snackbar />
  </main>
</div>

<style lang="scss">
  main {
    height: 100vh;
    overflow: hidden;

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: 'gallery pane';

    @media (max-width: 599px) {
      grid-template-rows: 2fr 1fr;
      grid-template-areas: 'pane' 'gallery';
    }
  }
</style>
