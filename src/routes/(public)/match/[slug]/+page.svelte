<script lang="ts">
  import { onMount } from 'svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';

  export let data: import('./$types').PageData;

  const { current: portrait, next } = data;

  onMount(() => {
    // preload next portrait
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = `${PORTRAITS_IMAGE_PATH}/${next.id}/${next.image}`;
  });
</script>

<main>
  <section class="portrait">
    <img
      loading="eager"
      src={`${PORTRAITS_IMAGE_PATH}/${portrait.id}/${portrait.image}`}
      alt="portrait"
    />
  </section>
  <section class="tags">tags</section>
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    height: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: min(40px, 5%);

    section.portrait {
      display: flex;
      justify-content: flex-end;

      img {
        max-height: 256px;
        max-width: 256px;
      }
    }
  }
</style>
