<script lang="ts">
  import { setContext } from 'svelte';
  import { page } from '$app/stores';

  import { swipe } from '$lib/events/swipe';

  import type { LayoutData } from './$types';
  import Arrows from './Arrows.svelte';
  import { Carousel } from './carousel';

  export let data: LayoutData;

  let carousel = new Carousel(data.items, data.currentId);
  setContext('carousel', carousel);

  const keyBindings = {
    drill: ['Enter', 'NumpadEnter'],
    next: ['Space', 'ArrowRight', 'ArrowDown'],
    prev: ['ArrowLeft', 'ArrowUp', 'Backspace']
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const isGallery = $page.route.id?.match('/gallery/');
    if (isGallery && keyBindings.drill.includes(event.code)) {
      event.preventDefault();
      location.href = `/${carousel.currentId}`;
      return;
    }

    if (keyBindings.next.includes(event.code)) {
      event.preventDefault();
      carousel.next();
    }

    if (keyBindings.prev.includes(event.code)) {
      event.preventDefault();
      carousel.prev();
    }
  };
</script>

<svelte:window
  on:keydown={handleKeydown}
  use:swipe
  on:swipeRight={carousel.next}
  on:swipeLeft={carousel.prev}
/>

<main>
  <slot />
  <Arrows next={carousel.next} prev={carousel.prev} />
</main>

<style lang="scss">
  main {
    height: 100%;
    flex: 1;
    overflow-y: auto;
  }
</style>
