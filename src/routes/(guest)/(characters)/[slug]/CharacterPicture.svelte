<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import Picture from '$lib/components/picture/Picture.svelte';
  import LikeButton from '$lib/components/like/LikeButton.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <Picture src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />

  <div class="actions">
    <div class="favorite">
      <LikeButton {item} />
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

      * {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $text;

        transition: background-color 0.3s ease-in-out;
        background: color.adjust($on-surface, $alpha: -0.6);

        &:hover {
          background: color.adjust($on-surface, $alpha: -0.1);
        }
      }

      .favorite {
        border-radius: 20px;
        width: 58px;
        height: 28px;
        top: 0.5rem;
        right: 0.5rem;
      }
    }
  }
</style>
