<script lang="ts">
  import { getContext } from 'svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import CharacterDetails from './CharacterDetails.svelte';
  import type { Carousel } from '../carousel';

  const carousel: Carousel = getContext('carousel');
  const item = carousel.currentItem;

  const bioHtml = `<p style="margin-block-start: 0">
    ${item.bio.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />')}
  </p>`;
</script>

<main>
  <div class="container">
    <div class="left-column">
      <img
        src={`${PORTRAITS_IMAGE_PATH}/${item.image}`}
        alt="Character portrait"
        draggable="false"
      />
      <CharacterDetails {item} />
    </div>
    <div class="right-column">
      {@html bioHtml}
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';
  $mobile: 'max-width: 599px';

  main {
    overflow-y: auto;

    padding: 16px 32px;
    display: flex;
    justify-content: center;

    @media ($mobile) {
      padding: 0;
    }

    font-size: 14px;
    font-family: Helvetica, sans-serif;
    color: #dee7ea;

    .container {
      max-width: 1050px;
      height: max-content;
      background-color: #170904d9;

      padding: 16px;
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 320px 1fr;
      justify-items: center;

      @media ($mobile) {
        grid-template-columns: minmax(200px, 380px);
        grid-template-rows: auto 1fr;
      }

      .left-column {
        display: flex;
        flex-direction: column;
        gap: 16px;

        img {
          user-select: none;
          aspect-ratio: 1/1;
          width: 100%;
        }
      }
    }
  }
</style>
