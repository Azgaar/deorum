<script lang="ts">
  import { page } from '$app/stores';
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import { Role } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import RemoveButton from './RemoveButton.svelte';
  import ShowDetailsButton from './ShowDetailsButton.svelte';
  import AdminEditCharacterButton from './details/AdminEditCharacterButton.svelte';
  import AdminEditPortraitButton from './details/AdminEditPortraitButton.svelte';
  import CharacterPicture from './details/CharacterPicture.svelte';
  import DownloadButton from './details/DownloadButton.svelte';
  import EditCharacterButton from './details/EditCharacterButton.svelte';
  import ReportButton from './details/ReportButton.svelte';

  export let item: IGalleryItem;
  export let actionable: boolean;

  function getFeatures({ race, archetype, background }: IGalleryItem) {
    const undefinedLabel: string = $t('common.values.undefined');

    const features: { value: string; title: string }[] = [];
    if (race) {
      const raceLabel: string = $t(`common.races.${race}`, { default: race || undefinedLabel });
      features.push({ value: raceLabel, title: `${$t('common.character.race')}: ${raceLabel}` });
    }

    if (archetype) {
      const archetypeLabel: string = $t(`common.archetypes.${archetype}`, {
        default: archetype || undefinedLabel
      });
      features.push({
        value: archetypeLabel,
        title: `${$t('common.character.archetype')}: ${archetypeLabel}`
      });
    }

    if (background) {
      const backgroundLabel: string = $t(`common.backgrounds.${background}`, {
        default: background || undefinedLabel
      });
      features.push({
        value: backgroundLabel,
        title: `${$t('common.character.background')}: ${backgroundLabel}`
      });
    }

    return features;
  }
</script>

<figure>
  <div class="imageContainer">
    <CharacterPicture {item} />

    {#if actionable}
      <Actions>
        <svelte:fragment slot="top-left">
          {#if $page.data.role === Role.ADMIN}
            <AdminEditCharacterButton {item} />
            <AdminEditPortraitButton {item} />
          {/if}
        </svelte:fragment>

        <svelte:fragment slot="top-right">
          {#if item.creator}
            <RemoveButton {item} />
          {:else}
            <LikeButton {item} />
          {/if}
        </svelte:fragment>

        <svelte:fragment slot="bottom-right">
          <EditCharacterButton bind:item />
          <ReportButton {item} />
          <DownloadButton {item} />
        </svelte:fragment>
      </Actions>
    {/if}
  </div>

  <figcaption>
    <h2>{item.name || $t('common.values.unnamed')}</h2>

    <div class="biography">{item.bio}</div>

    <div class="features">
      {#each getFeatures(item) as { value, title }}
        {#if actionable}
          <div {title} use:tooltip>{value}</div>
        {:else}
          <div>{value}</div>
        {/if}
      {/each}
    </div>

    <div class="showDetails">
      <ShowDetailsButton href={`${item.creator ? '/custom' : ''}/${item.id}`} {actionable} />
    </div>
  </figcaption>
</figure>

<style lang="scss">
  figure {
    position: relative;
    margin: 0;
    padding: 0.6rem 0.6rem 0.8rem;
    background-color: $surface;

    div.imageContainer {
      overflow: hidden;
      position: relative;
    }

    figcaption {
      display: flex;
      flex-direction: column;
      place-items: center;
      overflow: hidden;
      gap: 8px;

      h2 {
        font-size: 1.4em;
        margin: 4px 0 0;
        text-shadow: 0px 0px 1rem black;
      }

      div.biography {
        padding: 0 2px;
        font-size: 0.85em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        min-height: 39px;
      }

      div.features {
        margin-top: 2px;
        font-size: 0.85em;
        display: flex;
        gap: 0.5rem;

        > div {
          max-width: 150px;
          padding: 0.4em 1em;
          border-radius: 1em;
          background-color: rgb($on-surface, 0.9);
          white-space: nowrap;
        }
      }

      div.showDetails {
        font-size: 0.6rem;
        align-self: flex-end;
        margin-top: -2px;
      }
    }
  }
</style>
