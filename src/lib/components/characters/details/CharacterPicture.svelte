<script lang="ts">
  import Picture from '$lib/components/picture/Picture.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
</script>

<Picture src={item.image && `${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />
