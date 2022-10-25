<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { sliceElements } from '$lib/utils/array';

  export let data: import('./$types').PageData;

  function getCarouselItems(items: { id: string; image: string }[], currentId: string) {
    const currentIdx = items.findIndex(({ id }) => id === currentId);
    const before = sliceElements(items, currentIdx - 2, currentIdx);
    const after = sliceElements(items, currentIdx + 1, currentIdx + 3);
    return [...before, items[currentIdx], ...after];
  }

  $: carousel = getCarouselItems(data.items, data.currentId);
</script>

<section class="carousel">
  {#each carousel as item}
    <figure>
      <img src={`${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}`} alt={item.id} />
      <figcaption>{item.id}</figcaption>
    </figure>
  {/each}
</section>

<style lang="scss">
  section.carousel {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    white-space: nowrap;

    figure {
      position: relative;
      margin: 0;

      img {
        width: 256px;
        aspect-ratio: 1/1;
      }
    }
  }
</style>
