<script lang="ts">
  import { fade } from 'svelte/transition';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
  export let isCentral: boolean;
  export let id: string;
</script>

<figure>
  <div class="imageContainer">
    <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />
    {#if isCentral}
      <a class="showDetails" href={`/${id}`} transition:fade>
        <Wrapper>
          <ArrowRight />
          <Tooltip>{$t('common.gallery.showDetails')}</Tooltip>
        </Wrapper>
      </a>
    {/if}
  </div>

  <figcaption>
    <h1>{item.name}</h1>
    <section>
      <div>
        <Wrapper>
          <div>{$t(`common.races.${item.race}`, { default: item.race })}</div>
          <Tooltip>{$t('common.character.race')}</Tooltip>
        </Wrapper>
      </div>

      <div>
        <Wrapper>
          <div>{$t(`common.archetypes.${item.archetype}`, { default: item.archetype })}</div>
          <Tooltip>{$t('common.character.archetype')}</Tooltip>
        </Wrapper>
      </div>

      <div>
        <Wrapper>
          <div>{$t(`common.backgrounds.${item.background}`, { default: item.background })}</div>
          <Tooltip>{$t('common.character.background')}</Tooltip>
        </Wrapper>
      </div>
    </section>
  </figcaption>
</figure>

<style lang="scss">
  @use 'sass:color';

  figure {
    position: relative;
    margin: 0;
    padding: 0.6rem;
    background-color: $surface;

    div.imageContainer {
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        aspect-ratio: 1/1;
      }

      a.showDetails {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        padding: 0.5rem;

        outline: none;
        border: none;
        border-radius: 50%;
        color: $text;
        cursor: pointer;

        transition: background-color 0.3s ease-in-out;
        background: color.adjust($on-surface, $alpha: -0.6);

        &:hover {
          background: color.adjust($on-surface, $alpha: -0.1);
        }
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
          max-width: 70px;
          padding: 0.4em 1em;
          border-radius: 1em;
          background-color: color.adjust($on-surface, $alpha: -0.1);

          > div {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
