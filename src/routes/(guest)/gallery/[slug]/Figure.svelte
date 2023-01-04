<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { TGender } from '$lib/types/api.types';

  export let item: IGalleryItem;

  const getGenderIcon = (gender: TGender | '') => {
    if (gender === 'male') return '♂️';
    if (gender === 'female') return '♀️';
    return '🤷‍♂️';
  };
</script>

<figure>
  <div class="imageContainer">
    <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />
  </div>

  <figcaption>
    <h1>{item.name} {getGenderIcon(item.gender)}</h1>
    <aside>
      <span>{$t(`common.races.${item.race}`, { default: item.race })}</span>
      <span>{item.age}</span>
      <span>{$t(`common.backgrounds.${item.background}`, { default: item.background })}</span>
    </aside>
  </figcaption>
</figure>

<style lang="scss">
  @use 'sass:color';

  figure {
    position: relative;
    margin: 0;
    padding: 1rem;
    background-color: $surface;
    cursor: pointer;

    div.imageContainer {
      overflow: hidden;

      img {
        width: 100%;
        aspect-ratio: 1/1;
      }
    }

    figcaption {
      display: grid;
      grid-template-rows: 3fr 2fr;
      place-items: center;

      h1 {
        font-size: 1.4em;
        margin: 0;
        text-shadow: 0px 0px 1rem black;
      }

      aside {
        display: flex;
        gap: 0.5rem;

        span {
          padding: 0.4em 1em;
          border-radius: 1em;
          background-color: rgba(36, 19, 18, 0.9);
        }
      }
    }
  }
</style>
