<script lang="ts">
  import Spinner from '$lib/components/spinner/Spinner.svelte';
  import { PORTRAIT_SIZE } from '$lib/config';
  import { fade } from 'svelte/transition';

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
  <svg class="placeholder" width="100%" viewBox={`0 0 ${PORTRAIT_SIZE} ${PORTRAIT_SIZE}`}>
    <rect width={PORTRAIT_SIZE} height={PORTRAIT_SIZE} />
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
