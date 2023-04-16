<script lang="ts">
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import RemoveButton from './RemoveButton.svelte';
  import ShowDetailsButton from './ShowDetailsButton.svelte';

  export let item: IGalleryItem;
  export let actionable: boolean;

  $: race = $t(`common.races.${item.race}`, { default: item.race });
  $: archetype = $t(`common.archetypes.${item.archetype}`, { default: item.archetype });
  $: background = $t(`common.backgrounds.${item.background}`, { default: item.background });

  $: features = [
    { value: race, title: `${$t('common.character.race')}: ${race}` },
    { value: archetype, title: `${$t('common.character.archetype')}: ${archetype}` },
    { value: background, title: `${$t('common.character.background')}: ${background}` }
  ];
</script>

<figure>
  <div class="imageContainer">
    <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />

    {#if actionable}
      <Actions>
        <div slot="top">
          {#if item.creator}
            <RemoveButton {item} />
          {:else}
            <LikeButton {item} />
          {/if}
        </div>

        <ShowDetailsButton
          slot="bottom"
          href={`${item.creator ? '/myCharacters' : ''}/${item.id}`}
        />
      </Actions>
    {/if}
  </div>

  <figcaption>
    <h1>{item.name}</h1>
    <section>
      {#each features as { value, title } (value)}
        {#if actionable}
          <div {title} use:tooltip>{value}</div>
        {:else}
          <div>{value}</div>
        {/if}
      {/each}
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
      display: flex;
      flex-direction: column;
      place-items: center;
      overflow: hidden;

      h1 {
        font-size: 1.4em;
        margin: 10px;
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
        }
      }
    }
  }
</style>
