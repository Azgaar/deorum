<script lang="ts">
  import { fade } from 'svelte/transition';
  import Spinner from '$lib/components/spinner/Spinner.svelte';

  export let src: string;
  export let alt: string;
  export let loading: 'lazy' | 'eager' | undefined = 'eager';

  let prevSrc = '';
  let isLoading = false;

  const onSrcChange = (_: string) => {
    if (prevSrc && prevSrc !== src) isLoading = true;
    prevSrc = src;
  };

  const onLoad = () => {
    isLoading = false;
  };

  $: onSrcChange(src);

  const fadeDelayed = { duration: 300, delay: 500 };
</script>

<div class="picture">
  <svg class="placeholder" width="100%" viewBox="0 0 512 512">
    <rect width="512" height="512" />
  </svg>

  {#key src}
    {#if src}
      <img {src} {alt} {loading} draggable="false" on:load={onLoad} on:error={onLoad} />
    {/if}
  {/key}

  {#if isLoading}
    <div class="spinner" in:fade={fadeDelayed}>
      <Spinner />
    </div>
  {/if}
</div>

<style lang="scss">
  div.picture {
    position: relative;
    width: 100%;
    user-select: none;

    svg.placeholder {
      fill: $secondary;
      border-radius: 4px;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      aspect-ratio: 1/1;
    }

    div.spinner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
