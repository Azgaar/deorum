<script lang="ts">
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import CharacterData from './CharacterData.svelte';
  import CharacterPicture from './CharacterPicture.svelte';

  export let item: IGalleryItem;

  const getBioHtml = (bio: string) => `<p style="margin-block-start: 0">
    ${bio.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />')}
  </p>`;
</script>

<div class="wrapper">
  <article id="characterCard">
    <section class="content">
      <div class="left-column">
        <CharacterPicture {item} />
        <CharacterData {item} />
      </div>

      <div class="right-column">
        {#key item.bio}
          {@html getBioHtml(item.bio)}
        {/key}
      </div>
    </section>
  </article>
</div>

<style lang="scss">
  @use 'sass:color';

  div.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    color: #dee7ea;

    padding-top: 16px;
    @media ($mobile) {
      padding-top: 0;
    }

    article {
      max-width: 1050px;
      height: max-content;
      background-color: #170904d9;

      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      section.content {
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

        .right-column {
          line-height: 1.2;
        }
      }
    }
  }
</style>
