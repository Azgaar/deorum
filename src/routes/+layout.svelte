<script lang="ts" context="module">
  import { navigating } from '$app/stores';

  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import Spinner from '$lib/components/spinner/Spinner.svelte';
</script>

<svelte:head>
  <title>Deorum</title>
</svelte:head>

<slot />

<div class="loading" class:navigating={$navigating}>
  <Spinner />
</div>

<Snackbar />

<style lang="scss">
  @use 'sass:color';

  div.loading {
    position: fixed;
    inset: 0;
    background-color: color.adjust($surface, $alpha: -0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s linear;
  }

  div.navigating {
    opacity: 1;
    visibility: visible;
  }
</style>
