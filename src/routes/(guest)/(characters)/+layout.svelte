<script lang="ts">
  import { onMount, setContext } from 'svelte';

  import { createSwipeListener } from '$lib/events/swipe';

  import type { LayoutData } from './$types';
  import Arrows from './Arrows.svelte';
  import { Carousel } from './carousel';

  export let data: LayoutData;

  let carousel = new Carousel(data.items, data.currentId);
  setContext('carousel', carousel);

  onMount(() => {
    const seeDetails = ['Enter', 'NumpadEnter'];
    const rotateRightKeys = ['Space', 'ArrowRight', 'ArrowDown'];
    const rotateLeftKeys = ['ArrowLeft', 'ArrowUp', 'Backspace'];

    const handleKeydown = (event: KeyboardEvent) => {
      if (seeDetails.includes(event.code)) {
        event.preventDefault();
        location.href = `/${data.currentId}`;
        return;
      }

      if (rotateRightKeys.includes(event.code)) {
        event.preventDefault();
        carousel.next();
      }

      if (rotateLeftKeys.includes(event.code)) {
        event.preventDefault();
        carousel.prev();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    createSwipeListener(window);
    window.addEventListener('swipe-right', carousel.next);
    window.addEventListener('swipe-left', carousel.prev);

    return () => {
      window.removeEventListener('keydown', handleKeydown);

      window.removeEventListener('swipe-right', carousel.next);
      window.removeEventListener('swipe-left', carousel.prev);
      createSwipeListener(window)();
    };
  });
</script>

<main>
  <slot />
  <Arrows next={carousel.next} prev={carousel.prev} />
</main>

<style lang="scss">
  main {
    height: 100%;
    overflow-y: auto;
  }
</style>
