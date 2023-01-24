<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Duplicates from './Duplicates.svelte';

  export let data: import('./$types').PageData;

  type TPortrait = import('./$types').PageData['portraitData'][number];
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

  const openDuplicates = () => {
    const duplicateIds = duplicates.map(({ id }) => `id="${id}"`).join(' || ');
    window.open(`/admin/portraits?filter=${duplicateIds}`);
  };
</script>

<main>
  <section class="gallery container">
    <div class="grid">
      {#each portraitData as { id, image } (id)}
        <div class="imageContainer">
          <img
            loading="lazy"
            alt={id}
            src={`${PORTRAITS_IMAGE_PATH}/${id}/${image}`}
            on:load={handleLoad({ id, image })}
          />
        </div>
      {/each}
    </div>

    {#if portraitData.length === 0}
      <div>No portraits found</div>
    {/if}
  </section>

  <aside class="pane container">
    <Duplicates {duplicates} />
  </aside>
</main>

<style lang="scss">
  @use 'sass:color';

  $pane-width-min: 360px;
  $pane-width-max: 460px;

  main {
    height: 100vh;
    overflow: hidden;
    user-select: none;

    display: grid;
    grid-template-columns: 3fr minmax($pane-width-min, 1fr);
    grid-template-areas: 'gallery pane';

    .gallery {
      .grid {
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

        @media (max-width: 1199px) {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        @media (max-width: 899px) {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        @media (max-width: 599px) {
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        }

        .imageContainer {
          position: relative;
          aspect-ratio: 1;

          img {
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .container {
      width: 100%;
      overflow: auto;
    }

    aside.pane {
      grid-area: pane;
      background-image: url('/images/menu.webp');
      background-size: 100% 100%;

      display: flex;
      justify-content: center;

      @media (max-width: 599px) {
        display: flex;
        justify-content: center;
        padding: 1rem 2rem;
        width: auto;
      }
    }
  }
</style>
