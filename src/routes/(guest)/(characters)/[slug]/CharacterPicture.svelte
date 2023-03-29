<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Actions from '$lib/components/actions/Actions.svelte';
  import Picture from '$lib/components/picture/Picture.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import EditCharacterButton from './EditCharacterButton.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import DownloadButton from './DownloadButton.svelte';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <Picture src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />
  <Actions>
    <LikeButton {item} slot="top" />

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
