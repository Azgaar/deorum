<script lang="ts">
  import { slide } from 'svelte/transition';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import CharacterDetails from './CharacterDetails.svelte';
  import Picture from '$lib/components/picture/Picture.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const getBioHtml = (bio: string) => `<p style="margin-block-start: 0">
    ${bio.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />')}
  </p>`;
</script>

<div id="characterCard" class="content">
  <div class="left-column">
    <Picture src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt="Character portrait" />
    <CharacterDetails {item} />
  </div>

  <div class="right-column">
    {#key item.id}
      {@html getBioHtml(item.bio)}
    {/key}
  </div>
</div>

<style lang="scss">
  .content {
    max-width: 1050px;
    height: max-content;
    background-color: #170904d9;

    padding: 16px;
    display: grid;
    justify-items: center;
    grid-gap: 16px;
    grid-template-columns: 320px 1fr;

    @media ($mobile) {
      grid-template-columns: minmax(200px, 380px);
      grid-template-rows: auto 1fr;
    }

    .left-column {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
