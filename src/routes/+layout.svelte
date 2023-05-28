<script lang="ts">
  import { dev } from '$app/environment';
  import SigninContext from '$lib/components/auth/signin/SigninContext.svelte';
  import DialogProvider from '$lib/components/dialog/provider/DialogProvider.svelte';
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import LoadingOverlay from '$lib/components/spinner/LoadingOverlay.svelte';
  import { inject } from '@vercel/analytics';

  if (!dev) {
    inject({ mode: 'production' });
  }
</script>

<svelte:head>
  <title>Deorum: fantasy characters creator by Azgaar</title>
</svelte:head>

<SigninContext>
  <slot />
</SigninContext>

<DialogProvider />

<LoadingOverlay />

<Snackbar />
