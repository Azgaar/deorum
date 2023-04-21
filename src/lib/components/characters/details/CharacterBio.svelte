<script lang="ts">
  import type { IGalleryItem } from '$lib/types/gallery.types';
  export let item: IGalleryItem;

  const getBioHtml = (bio: string) => `<p style="margin-block-start: 0">
    ${bio.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />')}
  </p>`;
</script>

{#key item.bio}
  {@html getBioHtml(item.bio)}
{/key}
