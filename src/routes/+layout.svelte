<script lang="ts">
  import { dev } from '$app/environment';
  import { beforeNavigate, goto } from '$app/navigation';
  import SigninContext from '$lib/components/auth/signin/SigninContext.svelte';
  import DialogProvider from '$lib/components/dialog/provider/DialogProvider.svelte';
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';
  import LoadingOverlay from '$lib/components/spinner/LoadingOverlay.svelte';
  import { pages } from '$lib/config/pages';
  import { inject } from '@vercel/analytics';
  import '../theme/global.scss';

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
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BP26SDR8V6"></script>

  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-BP26SDR8V6');
  </script>
</svelte:head>

<SigninContext>
  <slot />
</SigninContext>

<DialogProvider />

<LoadingOverlay />

<Snackbar />
