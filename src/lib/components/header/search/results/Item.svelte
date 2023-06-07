<script lang="ts">
  import CharacterPicture from '$lib/components/characters/details/CharacterPicture.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { t } from '$lib/locales/translations';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';

  export let item: IGalleryItem;
</script>

<div class="preview">
  <CharacterPicture {item} />
  <div class="data">
    <div class="top">
      <div class="name">{item.name}</div>

      <a data-sveltekit-preload-data="hover" class="showDetails" href={item.id}>
        <span>{$t('common.gallery.showDetails')}</span>
        <ArrowRight width={16} />
      </a>
    </div>
    <div class="bio">{item.bio}</div>
  </div>
</div>

<style lang="scss">
  @use 'sass:color';

  .preview {
    padding: 0.5rem 0.2rem;
    border-bottom: 1px solid $secondary;

    display: grid;
    align-items: center;
    grid-template-columns: 1fr 8fr;
    gap: 8px;

    transition: all 0.2s ease-in-out;

    .data {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .showDetails {
          font-size: 0.5rem;
          color: $text;
          text-transform: uppercase;

          display: flex;
          align-items: center;
          gap: 2px;

          @media ($desktop) {
            transition: opacity 0.5s ease-in-out;
            opacity: 0;
            visibility: hidden;
          }
        }
      }

      .bio {
        font-size: 0.85em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    &:hover {
      background: color.adjust($on-surface, $alpha: -0.8);

      .data {
        .top {
          .showDetails {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
</style>
