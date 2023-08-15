<script lang="ts">
  import { page } from '$app/stores';

  export let title: string;
  export let description: string;
  export let imageSrc: string;

  const url = $page.url.href;
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
</svelte:head>
