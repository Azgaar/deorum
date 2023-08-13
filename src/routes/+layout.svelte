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
  import { t } from '$lib/locales/translations';

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

  const url = 'https://deorum.vercel.app';
  const title = $t('common.meta.title');
  const description = $t('common.meta.description');
  const imageSrc = '/images/preview.jpg';
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageSrc} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="deorum.vercel.app" />
  <meta property="twitter:url" content={url} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageSrc} />

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
