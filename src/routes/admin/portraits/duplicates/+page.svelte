<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Grid from '../../Grid.svelte';
  import Duplicates from './Duplicates.svelte';
  import type { PageData } from './$types';

  type TPortrait = PageData['portraitData'][number];
  export let data: PageData;

  let { portraitData } = data;
  let duplicates: TPortrait[] = [];
  const sizeMap: { [key: number]: TPortrait[] } = {};

  const handleLoad = (portrait: TPortrait) => async (event: Event) => {
    const src = (event.target as HTMLImageElement)?.src;
    const res = await fetch(src);
    const contentLength = res.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : null;
    if (!size) return;

    sizeMap[size] = [...(sizeMap[size] || []), portrait];

    const sameSizePortraits = sizeMap[size];
    if (sameSizePortraits.length === 2) duplicates = [...duplicates, ...sizeMap[size]];
    else if (sameSizePortraits.length > 2) duplicates = [...duplicates, portrait];
  };

  const getSrc = (id: string, image: string) => `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
</script>

<section class="gallery">
  <Grid>
    {#each portraitData as { id, image } (id)}
      <figure>
        <img loading="lazy" alt={id} src={getSrc(id, image)} on:load={handleLoad({ id, image })} />
      </figure>
    {/each}
  </Grid>

  {#if portraitData.length === 0}
    <div>No portraits found</div>
  {/if}
</section>

<aside class="pane">
  <Duplicates {duplicates} />
</aside>

<style lang="scss">
  @use 'sass:color';
  .gallery {
    width: 100%;
    overflow: auto;

    figure {
      position: relative;
      margin: 0;
      aspect-ratio: 1;

      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
  }

  aside.pane {
    width: 100%;
    overflow: auto;

    grid-area: pane;
    background-image: url('/images/menu.webp');
    background-size: 100% 100%;

    display: flex;
    justify-content: center;

    @media ($mobile) {
      display: flex;
      justify-content: center;
      padding: 1rem 2rem;
      width: auto;
    }
  }
</style>
