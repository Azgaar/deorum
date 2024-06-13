<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import SidePane from '$lib/components/editor/sidebar/SidePane.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { PORTRAITS_IMAGE_PATH, PORTRAIT_SIZE } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { isConvertableFormat } from '$lib/utils/images';
  import Grid from '../../Grid.svelte';
  import type { PageData } from './$types';

  type TPortrait = PageData['portraitData'][number];
  export let data: PageData;

  let found: Record<string, TPortrait[]> = { unoptimized: [], misfits: [], duplicates: [] };
  const imageHashMap: { [hash: string]: TPortrait[] } = {};
  let analyzedCount = 0;

  const handleLoad = (portrait: TPortrait) => async (event: Event) => {
    console.info('Loaded image', portrait.id);

    const src = (event.target as HTMLImageElement)?.src;
    const res = await fetch(src);
    const image = await res.blob();

    // check if image is not optimized
    if (isConvertableFormat(src)) {
      found.unoptimized.push(portrait);
      found = found;
    }

    // check if image size is not expected
    const imageBitmap = await createImageBitmap(image);
    if (imageBitmap.width !== PORTRAIT_SIZE || imageBitmap.height !== PORTRAIT_SIZE) {
      found.misfits.push(portrait);
      found = found;
    }

    // check hash to find duplicates
    const arrayBuffer = await image.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (imageHashMap[hashHex]) {
      imageHashMap[hashHex].push(portrait);

      found.duplicates = Object.values(imageHashMap)
        .filter((portraits) => portraits.length > 1)
        .flat();
      found = found;
    } else {
      imageHashMap[hashHex] = [portrait];
    }

    analyzedCount++;
  };

  const getSrc = (id: string, image: string) => {
    return `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  };

  const handleOpenFound = (found: { id: string }[]) => {
    const ids = found.map(({ id }) => `id="${id}"`).join(' || ');
    window.open(`/admin/portraits?filter=${ids}`);
  };
</script>

<section class="gallery">
  <Grid>
    {#each data.portraitData as { id, image } (id)}
      <figure>
        <img loading="lazy" alt={id} src={getSrc(id, image)} on:load={handleLoad({ id, image })} />
      </figure>
    {/each}
  </Grid>

  {#if data.portraitData.length === 0}
    <div>{$t('admin.menu.notFound')}</div>
  {/if}
</section>

<SidePane>
  <section class="found">
    <header>
      <TextLogo size={56} />
      <Subtitle size={18}>{$t('admin.menu.searchHint')}</Subtitle>
    </header>

    <main>
      {#each Object.entries(found) as [name, list]}
        <div>
          {$t(`admin.menu.${name}`)}:

          {#if list.length}
            <div class="grid">
              {#each list as { id, image } (id)}
                <figure data-id={id}>
                  <img alt={id} src={getSrc(id, image)} />
                </figure>
              {/each}
            </div>
            <BasicButton onClick={() => handleOpenFound(list)}>
              {$t('admin.menu.openFound')}
            </BasicButton>
          {:else}
            {$t('admin.menu.notFound')}
          {/if}
        </div>
      {/each}
    </main>

    <footer>
      Analyzed {analyzedCount} out of {data.portraitData.length} images
    </footer>
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
