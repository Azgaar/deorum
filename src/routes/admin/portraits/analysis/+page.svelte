<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import SidePane from '$lib/components/editor/sidebar/SidePane.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { PORTRAITS_IMAGE_PATH, PORTRAIT_SIZE } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import Grid from '../../Grid.svelte';
  import type { PageData } from './$types';

  type TPortrait = PageData['portraitData'][number];
  export let data: PageData;

  let { portraitData } = data;

  let duplicates: TPortrait[] = [];
  const imageHashMap: { [hash: string]: TPortrait[] } = {};

  let misfits: TPortrait[] = [];

  const handleLoad = (portrait: TPortrait) => async (event: Event) => {
    const src = (event.target as HTMLImageElement)?.src;
    const res = await fetch(src);
    const image = await res.blob();

    // check if image size is not expected
    const imageBitmap = await createImageBitmap(image);
    if (imageBitmap.width !== PORTRAIT_SIZE || imageBitmap.height !== PORTRAIT_SIZE) {
      misfits = [...misfits, portrait];
    }

    // check hash to find duplicates
    const arrayBuffer = await image.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (imageHashMap[hashHex]) {
      imageHashMap[hashHex].push(portrait);

      duplicates = Object.values(imageHashMap)
        .filter((portraits) => portraits.length > 1)
        .flat();
    } else {
      imageHashMap[hashHex] = [portrait];
    }
  };

  const getSrc = (id: string, image: string) => `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;

  const handleOpenFound = (found: { id: string }[]) => {
    const ids = found.map(({ id }) => `id="${id}"`).join(' || ');
    window.open(`/admin/portraits?filter=${ids}`);
  };
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
  <section class="found">
    <header>
      <TextLogo size={56} />
      <Subtitle size={18}>{$t('admin.menu.searchHint')}</Subtitle>
    </header>

    <main>
      <div>
        <Subtitle size={18}>{$t('admin.menu.duplicates')}:</Subtitle>

        {#if duplicates.length}
          <div class="grid">
            {#each duplicates as { id, image } (id)}
              <figure data-id={id}>
                <img loading="lazy" alt={id} src={getSrc(id, image)} />
              </figure>
            {/each}
          </div>
          <BasicButton onClick={() => handleOpenFound(duplicates)}>
            {$t('admin.menu.openFound')}
          </BasicButton>
        {:else}
          {$t('admin.menu.notFound')}
        {/if}
      </div>

      <div>
        <Subtitle size={18}>{$t('admin.menu.misfits')}:</Subtitle>

        {#if misfits.length}
          <div class="grid">
            {#each misfits as { id, image } (id)}
              <figure data-id={id}>
                <img loading="lazy" alt={id} src={getSrc(id, image)} />
              </figure>
            {/each}
          </div>
          <BasicButton onClick={() => handleOpenFound(misfits)}>
            {$t('admin.menu.openFound')}
          </BasicButton>
        {:else}
          {$t('admin.menu.notFound')}
        {/if}
      </div>
    </main>
  </section>
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

  .found {
    padding: 3em 2em;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 1em;

    header {
      text-align: center;
    }

    main {
      display: flex;
      flex-direction: column;
      gap: 1.4em;

      & > div {
        display: flex;
        flex-direction: column;
        gap: 0.4em;

        div.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          overflow-y: auto;

          figure {
            position: relative;
            margin: 0;
            aspect-ratio: 1;

            img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
            }
          }
        }
      }
    }
  }
</style>
