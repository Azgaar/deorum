<script lang="ts" context="module">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
</script>

<head>
  <title>Deorum Admin</title>
</head>

<main>
  <slot />
  <Snackbar />
</main>

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
