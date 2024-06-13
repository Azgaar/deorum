<script lang="ts">
  import SidePane from '$lib/components/editor/sidebar/SidePane.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Grid from '../../Grid.svelte';
  import type { PageData } from './$types';
  import Duplicates from './Duplicates.svelte';

  type TPortrait = PageData['portraitData'][number];
  export let data: PageData;

  let { portraitData } = data;
  let duplicates: TPortrait[] = [];
  const hashMap: { [hash: string]: TPortrait[] } = {};

  const handleLoad = (portrait: TPortrait) => async (event: Event) => {
    const src = (event.target as HTMLImageElement)?.src;
    const res = await fetch(src);
    const image = await res.blob();

    const hashBuffer = await crypto.subtle.digest('SHA-256', await image.arrayBuffer());
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    console.info('Image', portrait.image, hashHex);

    if (hashMap[hashHex]) {
      hashMap[hashHex].push(portrait);

      duplicates = Object.values(hashMap)
        .filter((portraits) => portraits.length > 1)
        .flat();
    } else {
      hashMap[hashHex] = [portrait];
    }
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

<SidePane>
  <Duplicates {duplicates} />
</SidePane>

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
</style>
