<script lang="ts">
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import RemoveButton from '../RemoveButton.svelte';
  import CharacterPicture from './CharacterPicture.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import EditCharacterButton from './EditCharacterButton.svelte';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <CharacterPicture {item} />

  <Actions>
    <div slot="top">
      {#if item.creator}
        <RemoveButton {item} />
      {:else}
        <LikeButton {item} />
      {/if}
    </div>

    <svelte:fragment slot="bottom">
      <EditCharacterButton bind:item />
      <DownloadButton {item} />
    </svelte:fragment>
  </Actions>
</div>

<style lang="scss">
  @use 'sass:color';

  div.imageContainer {
    overflow: hidden;
    position: relative;
  }
</style>
