<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import ShowDetailsButton from '$lib/components/characters/ShowDetailsButton.svelte';
  import CharacterPicture from '$lib/components/characters/details/CharacterPicture.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import Grid from '../Grid.svelte';
  import Section from './Section.svelte';

  export let header: string;
  export let data: IGalleryItem[];
</script>

<Section {header}>
  <Grid>
    {#each data as item (item.id)}
      <figure>
        <div class="imageContainer">
          <CharacterPicture {item} />
          <Actions>
            <svelte:fragment slot="top-right">
              <LikeButton {item} />
            </svelte:fragment>
          </Actions>
        </div>

        <figcaption>
          <div class="name">{item.name}</div>

          <ActionButton href={`/${item.id}`}>
            <ArrowRight width={20} />
          </ActionButton>
        </figcaption>
      </figure>
    {/each}
  </Grid>
</Section>

<style lang="scss">
  figure {
    position: relative;
    margin: 0.2rem;
    padding: 0.6rem 0.6rem;
    background-color: $surface;

    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    div.imageContainer {
      overflow: hidden;
      position: relative;
      pointer-events: none;
    }

    figcaption {
      display: flex;
      justify-content: space-between;
      gap: 0.2em;

      div.name {
        font-size: 14px;
        max-width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
