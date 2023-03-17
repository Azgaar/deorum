<script lang="ts">
  import { inject } from '@vercel/analytics';
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { navigating } from '$app/stores';
  import { webVitals } from '$lib/scripts/vitals';

  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import Spinner from '$lib/components/spinner/Spinner.svelte';

  if (!dev) {
    inject({ mode: 'production' });
    webVitals({ page: $page.route.id || '' });
  }
</script>

<svelte:head>
  <title>Deorum: fantasy characters creator by Azgaar</title>
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
