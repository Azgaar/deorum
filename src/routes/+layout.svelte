<script lang="ts">
  import { dev } from '$app/environment';
  import { navigating, page } from '$app/stores';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import Spinner from '$lib/components/spinner/Spinner.svelte';
  import { webVitals } from '$lib/scripts/vitals';
  import { inject } from '@vercel/analytics';

  if (!dev) {
    inject({ mode: 'production' });
    webVitals({ page: $page.route.id || '' });
  }
</script>

<svelte:head>
  <title>Deorum: fantasy characters creator by Azgaar</title>
</svelte:head>

<slot />

<Dialog />

<div aria-busy={Boolean($navigating)} aria-label="loader">
  <Spinner />
</div>

<Snackbar />

<style lang="scss">
  @use 'sass:color';

  div {
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

    &[aria-busy='true'] {
      opacity: 1;
      visibility: visible;
    }
  }
</style>
