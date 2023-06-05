<script lang="ts">
  import CharacterPicture from '$lib/components/characters/details/CharacterPicture.svelte';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
</script>

<div class="item">
  <CharacterPicture {item} />
  <div class="details">
    <div class="name">{item.name}</div>
    <div class="bio">{item.bio}</div>
  </div>
</div>

<style lang="scss">
  div.item {
    padding: 0.5rem;
    border-bottom: 1px solid $secondary;

    display: grid;
    align-items: center;
    grid-template-columns: 1fr 8fr;
    gap: 8px;

    .details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .bio {
        font-size: 0.85em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
