<script lang="ts">
  import { onMount } from 'svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { toastError } from '$lib/stores';
  import { sliceElements } from '$lib/utils/array';
  import { preloadImage, request } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';

  import type { PBError } from '$lib/types/error.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';

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
  const refreshCarousel = () => (carousel = getCarouselItems(data.items, data.currentId));

  // lazily preload images that comes initially, but not displayed in the carousel
  const carouselIds = carousel.map(({ id }) => id);
  const initialItemsInReserve = data.items.filter(({ id }) => !carouselIds.includes(id));
  initialItemsInReserve.forEach(preloadImage);

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
      const moreItems: IGalleryItem[] = await request(
        `/api/gallery/more?edgeId=${edgeId}&right=${right}`
      );
      moreItems.forEach(preloadImage);

      data.items = right ? [...data.items, ...moreItems] : [...moreItems, ...data.items];
      refreshCarousel();
    } catch (error) {
      report('gallery', error, { right });
      toastError((error as PBError).message);
    } finally {
      isLoadingMore = false;
    }
  };

  const handleClick = (id: string) => () => {
    // temp, rework to show details
    if (id === data.currentId) return;
    showNext(id > data.currentId)();
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
        <img
          src={`${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}`}
          alt={item.id}
          draggable="false"
        />
        {#if item.id === data.currentId}
          <figcaption>
            <div>
              <h1>{item.name || ''}</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget rutrum erat, quis
                tristique magna. Etiam sit amet volutpat mauris. Pellentesque eu fermentum augue,
                eget porttitor ipsum. Vivamus porttitor erat lorem...
              </p>
              <aside>
                <span>Human</span>
                <span>Warlock</span>
              </aside>
            </div>
          </figcaption>
        {/if}
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
      --carousel-item-height: 150px;
      --carousel-item-width: 150px;
      max-width: 1000px;
      min-height: 360px;
      font-size: 14px;
      z-index: 0;

      @media screen and (max-width: 599px) {
        max-width: 320px;
        font-size: 14px;
      }

      @media screen and (min-width: 1200px) {
        --carousel-item-height: 150px;
        --carousel-item-width: 150px;
        max-width: 1000px;
        font-size: 14px;
      }

      @media screen and (min-width: 1500px) {
        --carousel-item-height: 170px;
        --carousel-item-width: 170px;
        max-width: 1200px;
        font-size: 18px;
      }

      @media screen and (min-width: 1920px) {
        --carousel-item-height: 200px;
        --carousel-item-width: 200px;
        max-width: 1500px;
        font-size: 20px;
      }

      @media screen and (min-width: 2500px) {
        --carousel-item-height: 256px;
        --carousel-item-width: 256px;
        max-width: 2000px;
        font-size: 26px;
      }

      position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;

      figure {
        position: absolute;
        margin: 0;
        width: var(--carousel-item-width);
        height: var(--carousel-item-height);
        z-index: 0;
        opacity: 0;

        transform: translateX(-50%);
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        cursor: pointer;

        img {
          width: 100%;
          aspect-ratio: 1/1;

          transition: all 0.5s ease-out;
          transform: scale3d(1, 1, 1);
        }

        figcaption {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;

          outline-color: color.adjust($text, $alpha: -1);
          outline-style: double;
          outline-width: 2px;
          outline-offset: -4px;
          transition: outline 0.2s ease-out;
          transition-delay: 0.2s;

          div {
            position: absolute;
            padding: 16px 32px;
            height: calc(100% - 2 * 16px);

            top: 78%;
            transition: all 0.4s ease-out;

            display: grid;
            grid-template-rows: 1fr 3fr 1fr;
            place-items: center;

            h1 {
              font-size: 1.5em;
              margin: 0;
              text-shadow: 0px 0px 12px black;
            }

            p {
              margin: 0;
            }

            aside {
              display: flex;
              gap: 8px;

              span {
                padding: 4px 8px;
                border-radius: 12px;
                background-color: rgba(36, 19, 18, 0.9);
              }
            }
          }
        }
      }

      figure.current:hover {
        img {
          filter: brightness(0.4);
          transform: scale3d(1.25, 1.25, 1);
        }

        figcaption {
          outline-color: color.adjust($text, $alpha: -0.5);

          div {
            top: 0%;
          }
        }
      }

      figure:nth-child(1),
      figure:nth-child(5) {
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
        height: calc(var(--carousel-item-height) * 1.6);
        width: calc(var(--carousel-item-width) * 1.6);
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
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.45),
          0 0 110px rgba(0, 0, 0, 0.25), 0 0 100px rgba(0, 0, 0, 0.1);
        height: calc(var(--carousel-item-height) * 2);
        width: calc(var(--carousel-item-width) * 2);
        left: 50%;
        z-index: 2;

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
