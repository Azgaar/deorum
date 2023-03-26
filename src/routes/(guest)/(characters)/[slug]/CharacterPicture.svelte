<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Picture from '$lib/components/picture/Picture.svelte';
  import LikeButton from '$lib/components/like/LikeButton.svelte';
  import EditCharacterButton from './EditCharacterButton.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import DownloadButton from './DownloadButton.svelte';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <Picture src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />

  <div class="actions">
    <div class="pane top">
      <LikeButton {item} />
    </div>

    <div class="pane bottom">
      <EditCharacterButton bind:item />
      <DownloadButton {item} />
    </div>
  </div>
</div>

<style lang="scss">
  @use 'sass:color';

  div.imageContainer {
    overflow: hidden;
    position: relative;

    div.actions {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;

      div.pane {
        position: absolute;

        border-radius: 20px;
        background: color.adjust($on-surface, $alpha: -0.6);
        display: flex;
        gap: 4px;

        &.top {
          top: 0.5rem;
          right: 0.5rem;
        }

        &.bottom {
          bottom: 0.5rem;
          right: 0.5rem;
        }
      }
    }
  }
</style>
