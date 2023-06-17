<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { Carousel } from '$lib/components/characters/carousel';
  import { swipe } from '$lib/events/swipe';
  import { allowHotkeys } from '$lib/utils/hotkeys';
  import { setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { LayoutData } from './$types';
  import Arrows from './Arrows.svelte';

  export let data: LayoutData;

  let carousel = new Carousel(data.items, data.currentId);
  setContext('carousel', carousel);
  $: carousel.updateCarousel(data.items, data.currentId);

  const keyBindings = {
    drill: ['Enter', 'NumpadEnter'],
    next: ['Space', 'ArrowRight', 'ArrowDown'],
    prev: ['ArrowLeft', 'ArrowUp']
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!allowHotkeys()) return;

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

  // moving to other layout doesn't trigger onMount callback
  // so we need to remove event listeners manually on afterNavigate
  afterNavigate(() => {
    const isLayoutChanged = !$page.route.id?.match('(characters)');
    if (isLayoutChanged) {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('swipeRight', carousel.next);
      window.removeEventListener('swipeLeft', carousel.prev);
    }
  });
</script>

<svelte:window
  on:keydown={handleKeydown}
  use:swipe
  on:swipeRight={carousel.next}
  on:swipeLeft={carousel.prev}
/>

<main aria-label="characters layout" transition:fade>
  <slot />
  <Arrows next={carousel.next} prev={carousel.prev} />
</main>

<style lang="scss">
  main {
    grid-area: main;
    overflow-y: auto;
  }
</style>
