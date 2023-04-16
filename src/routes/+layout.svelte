<script lang="ts">
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import LoadingOverlay from '$lib/components/spinner/LoadingOverlay.svelte';
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

<LoadingOverlay />

<Snackbar />
