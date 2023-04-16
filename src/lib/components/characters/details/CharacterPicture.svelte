<script lang="ts">
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import Picture from '$lib/components/picture/Picture.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import RemoveButton from '../RemoveButton.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import EditCharacterButton from './EditCharacterButton.svelte';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <Picture src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />
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
