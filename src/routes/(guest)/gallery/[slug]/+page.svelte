<script lang="ts">
  import { onMount } from 'svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { toastError } from '$lib/stores';
  import { createSwipeListener } from '$lib/events/swipe';
  import { sliceElements } from '$lib/utils/array';
  import { preloadImage, request } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import Figure from './Figure.svelte';
  import Arrows from './Arrows.svelte';

  export let data: import('./$types').PageData;

  const CURRENT_INDEX = 2;
  const TAIL_IMAGES = 2;
  const LOAD_ON_IMAGES_LEFT = 8;

  let isLoadingMore = false;

  function getCarouselItems(items: IGalleryItem[], currentId: string) {
    const currentIdx = items.findIndex(({ id }) => id === currentId);
    const before = sliceElements(items, currentIdx - TAIL_IMAGES, currentIdx);
    const after = sliceElements(items, currentIdx + 1, currentIdx + 1 + TAIL_IMAGES);
    return [...before, items[currentIdx], ...after];
  }

  // select carousel items
  let carousel = getCarouselItems(data.items, data.currentId);
  const refreshCarousel = () => {
    carousel = getCarouselItems(data.items, data.currentId);
  };

  // lazily preload images that comes initially, but not displayed in the carousel
  const carouselIds = carousel.map(({ id }) => id);
  const initialItemsInReserve = data.items.filter(({ id }) => !carouselIds.includes(id));
  initialItemsInReserve.forEach((item) => preloadImage(`${PORTRAITS_IMAGE_PATH}/${item.image}`));

  const showNext = (right: boolean) => () => {
    const nextIndex = right ? CURRENT_INDEX + 1 : CURRENT_INDEX - 1;
    const nextId = carousel[nextIndex].id;
    history.pushState({}, '', `./${nextId}`); // don't trigger server update
    data.currentId = nextId;
    refreshCarousel();

    const dataIndex = data.items.findIndex(({ id }) => id === nextId);
    const itemsBeforeEnd = Math.min(dataIndex, data.items.length - dataIndex);
    if (itemsBeforeEnd < LOAD_ON_IMAGES_LEFT) loadMore(right);
  };

  const loadMore = async (right: boolean) => {
    if (isLoadingMore) return;

    isLoadingMore = true;
    const edgeId = right ? data.items.at(-1)?.id : data.items.at(0)?.id;

    try {
      const url = `/api/gallery/more?edgeId=${edgeId}&right=${right}`;
      const moreItems = await request<IGalleryItem[]>(url);
      moreItems.forEach((item) => preloadImage(`${PORTRAITS_IMAGE_PATH}/${item.image}`));

      data.items = right ? [...data.items, ...moreItems] : [...moreItems, ...data.items];
      refreshCarousel();
    } catch (error) {
      report('gallery', error, { right });
      toastError(error);
    } finally {
      isLoadingMore = false;
    }
  };

  const handleClick = (id: string) => () => {
    if (id === data.currentId) {
      location.href = `/${id}`;
      return;
    }

    showNext(id > data.currentId)();
  };

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
        showNext(true)();
      }

      if (rotateLeftKeys.includes(event.code)) {
        event.preventDefault();
        showNext(false)();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    const goNext = showNext(true);
    const goPrev = showNext(false);

    createSwipeListener(window);
    window.addEventListener('swipe-right', goNext);
    window.addEventListener('swipe-left', goPrev);

    return () => {
      window.removeEventListener('keydown', handleKeydown);

      window.removeEventListener('swipe-right', goNext);
      window.removeEventListener('swipe-left', goPrev);
      createSwipeListener(window)();
    };
  });
</script>

<div class="container">
  <section class="carousel">
    {#each carousel as item (item.id)}
      <div class="item" on:click={handleClick(item.id)}>
        <Figure {item} />
      </div>
    {/each}
  </section>

  <Arrows {showNext} />
</div>

<style lang="scss">
  @use 'sass:color';
  div.container {
    width: 100%;
    user-select: none;

    section.carousel {
      --item-width: clamp(300px, 25vw, 512px);
      font-size: clamp(14px, 1.2vw, 26px);
      --second-item-scale: 0.8;
      --third-item-scale: 0.5;
      --image-zoom: 1.4;
      max-width: min(1800px, 85vw);
      min-height: 360px;
      z-index: 0;

      @media screen and (max-width: 599px) {
        max-width: 320px;
      }

      position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;

      .item {
        position: absolute;
        width: var(--item-width);
        z-index: 0;
        opacity: 0;

        transform: translateX(-50%) scale(1);
        transition: all 0.3s ease-in-out;
      }

      .item:nth-child(1),
      .item:nth-child(5) {
        transform: translateX(-50%) scale(var(--third-item-scale));
        opacity: 0.4;
        animation: fadeIn04 0.3s ease-in-out;

        @keyframes fadeIn04 {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.4;
          }
        }
      }

      .item:nth-child(2),
      .item:nth-child(4) {
        transform: translateX(-50%) scale(var(--second-item-scale));
        z-index: 1;
        opacity: 0.9;
      }

      .item:nth-child(1) {
        left: 15%;
      }

      .item:nth-child(2) {
        left: 30%;
      }

      .item:nth-child(3) {
        left: 50%;
        z-index: 2;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.45),
          0 0 110px rgba(0, 0, 0, 0.25), 0 0 100px rgba(0, 0, 0, 0.1);
        opacity: 1;
      }

      .item:nth-child(4) {
        left: 70%;
      }

      .item:nth-child(5) {
        left: 85%;
      }
    }
  }
</style>
