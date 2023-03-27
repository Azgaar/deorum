<script lang="ts">
  import { tooltip } from '$lib/scripts/tooltip';
  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/like/LikeButton.svelte';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import ShowDetailsButton from './ShowDetailsButton.svelte';

  export let item: IGalleryItem;
  export let isCentral: boolean;

  $: race = $t(`common.races.${item.race}`, { default: item.race });
  $: archetype = $t(`common.archetypes.${item.archetype}`, { default: item.archetype });
  $: background = $t(`common.backgrounds.${item.background}`, { default: item.background });
</script>

<figure>
  <div class="imageContainer">
    <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />

    {#if isCentral}
      <Actions>
        <LikeButton {item} slot="top" />
        <ShowDetailsButton slot="bottom" href={`/${item.id}`} />
      </Actions>
    {/if}
  </div>

  <figcaption>
    <h1>{item.name}</h1>
    <section>
      {#if isCentral}
        <section>
          <div title={`${$t('common.character.race')}: ${race}`} use:tooltip>{race}</div>
          <div title={`${$t('common.character.archetype')}: ${archetype}`} use:tooltip>
            {archetype}
          </div>
          <div title={`${$t('common.character.background')}: ${background}`} use:tooltip>
            {background}
          </div>
        </section>
      {:else}
        <section>
          <div>{race}</div>
          <div>{archetype}</div>
          <div>{background}</div>
        </section>
      {/if}
    </section>
  </figcaption>
</figure>

<style lang="scss">
  @use 'sass:color';

  figure {
    position: relative;
    margin: 0;
    padding: 0.6rem 0.6rem 0.8rem;
    background-color: $surface;

    div.imageContainer {
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        aspect-ratio: 1/1;
      }
    }

    figcaption {
      overflow: hidden;
      display: grid;
      grid-template-rows: 3fr 2fr;
      place-items: center;

      h1 {
        font-size: 1.4em;
        margin: 0;
        text-shadow: 0px 0px 1rem black;
      }

      section {
        display: flex;
        gap: 0.5rem;

        > div {
          max-width: 150px;
          padding: 0.4em 1em;
          border-radius: 1em;
          background-color: color.adjust($on-surface, $alpha: -0.1);

          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
