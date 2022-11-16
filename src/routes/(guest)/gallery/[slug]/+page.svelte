<script lang="ts">
  import { onMount } from 'svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { toastError } from '$lib/stores';
  import { sliceElements } from '$lib/utils/array';
  import { preloadImage, request } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';

  import type { IGalleryItem } from '$lib/types/gallery.types';
  import type { TGender } from '$lib/types/api.types';

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
    // temp, rework to show details
    if (id === data.currentId) return;
    showNext(id > data.currentId)();
  };

  const getGenderIcon = (gender: TGender | '') => {
    if (gender === 'male') return '♂️';
    if (gender === 'female') return '♀️';
    return '🤷‍♂️';
  };

  onMount(() => {
    const rotateRightKeys = ['Enter', 'Space', 'ArrowRight', 'ArrowDown'];
    const rotateLeftKeys = ['ArrowLeft', 'ArrowUp', 'Backspace'];

    const handleKeydown = (event: KeyboardEvent) => {
      if (rotateRightKeys.includes(event.code)) {
        event.preventDefault();
        showNext(true)();
      }

      if (rotateLeftKeys.includes(event.code)) {
        event.preventDefault();
        showNext(false)();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="container">
  <section class="carousel">
    {#each carousel as item (item.id)}
      <figure class:current={item.id === data.currentId} on:click={handleClick(item.id)}>
        <div class="imageContainer">
          <img src={`${PORTRAITS_IMAGE_PATH}/${item.image}`} alt={item.name} draggable="false" />
        </div>

        <figcaption>
          <h1>{item.name} {getGenderIcon(item.gender)}</h1>
          <aside>
            <span>{item.race}</span>
            <span>{item.age}</span>
            <span>{item.archetype}</span>
            <span>{item.background}</span>
          </aside>
        </figcaption>
      </figure>
    {/each}
  </section>

  <div class="arrows">
    <button aria-label="previous" on:click={showNext(false)}>
      <svg viewBox="0 0 5 20">
        <path d="M5 0 L0 10 L5 20 Z" />
      </svg>
    </button>

    <button aria-label="next" on:click={showNext(true)}>
      <svg viewBox="0 0 5 20">
        <path d="M0 0 L5 10 L0 20 Z" />
      </svg>
    </button>
  </div>
</div>

<style lang="scss">
  @use 'sass:color';
  div.container {
    width: 100%;
    user-select: none;

    section.carousel {
      --item-width: clamp(300px, 30vw, 512px);
      font-size: clamp(14px, 1.4vw, 28px);
      --second-item-scale: 0.8;
      --third-item-scale: 0.5;
      --image-zoom: 1.5;
      max-width: min(1800px, 90vw);
      min-height: 360px;
      z-index: 0;

      @media screen and (max-width: 599px) {
        max-width: 320px;
      }

      position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;

      figure {
        position: absolute;
        margin: 0;
        width: var(--item-width);
        height: calc(var(--item-width) * 1.25);
        z-index: 0;
        opacity: 0;

        transform: translateX(-50%) scale(1);
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        cursor: pointer;

        padding: 1rem;
        background-color: $surface;

        div.imageContainer {
          overflow: hidden;

          img {
            width: 100%;
            aspect-ratio: 1/1;

            transition: all 1s ease-out 1s;
            transform: translateY(0) scale3d(1, 1, 1);
          }

          img:hover {
            transform: translateY(25%) scale3d(var(--image-zoom), var(--image-zoom), 1);
          }
        }

        figcaption {
          display: grid;
          grid-template-rows: 3fr 2fr;
          place-items: center;

          h1 {
            font-size: 1.25rem;
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
      figure:nth-child(1),
      figure:nth-child(5) {
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

      figure:nth-child(2),
      figure:nth-child(4) {
        transform: translateX(-50%) scale(var(--second-item-scale));
        z-index: 1;
        opacity: 0.9;
      }

      figure:nth-child(1) {
        left: 15%;
      }

      figure:nth-child(2) {
        left: 30%;
      }

      figure:nth-child(3) {
        left: 50%;
        z-index: 2;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.45),
          0 0 110px rgba(0, 0, 0, 0.25), 0 0 100px rgba(0, 0, 0, 0.1);
        opacity: 1;
      }

      figure:nth-child(4) {
        left: 70%;
      }

      figure:nth-child(5) {
        left: 85%;
      }
    }

    div.arrows {
      button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        border: 0;
        background: none;
        cursor: pointer;
        color: $primary;
        transition: all 0.2s ease-in-out;
      }

      button:first-child {
        left: 0;
      }

      button:last-child {
        right: 0;
      }

      button:hover {
        color: color.scale($primary, $lightness: 5%);
      }

      svg {
        width: 50px;
        aspect-ratio: 1/2;
        fill: currentColor;
      }
    }
  }
</style>
