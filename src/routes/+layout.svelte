<script lang="ts">
  import { dev } from '$app/environment';
  import SigninContext from '$lib/components/auth/signin/SigninContext.svelte';
  import DialogProvider from '$lib/components/dialog/provider/DialogProvider.svelte';
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import LoadingOverlay from '$lib/components/spinner/LoadingOverlay.svelte';
  import { inject } from '@vercel/analytics';
  import '../theme/global.scss';
  import { beforeNavigate, goto } from '$app/navigation';
  import { pages } from '$lib/config/pages';

  if (!dev) inject({ mode: 'production' });

  // preserve search params when required
  beforeNavigate(({ from, to, cancel }) => {
    if (!from?.route.id || !to?.route.id) return;

    const goesToGallery = pages.gallery.includes(to.route.id);
    const fromSearch = from.url.searchParams.toString();
    const toSearch = to.url.searchParams.toString();

    if (goesToGallery && fromSearch && !toSearch) {
      cancel();
      goto(to.url.pathname + `?${decodeURIComponent(fromSearch)}`);
    }
  });
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
