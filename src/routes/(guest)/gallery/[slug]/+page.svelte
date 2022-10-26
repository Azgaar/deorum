<script lang="ts">
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { toastError } from '$lib/stores';
  import { sliceElements } from '$lib/utils/array';
  import { preloadImage } from '$lib/utils/loading';

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
      const response = await fetch(`/api/gallery/more?edgeId=${edgeId}&right=${right}`, {
        headers: { 'content-type': 'application/json' }
      });
      const moreItems: IGalleryItem[] = await response.json();
      moreItems.forEach(preloadImage);

      data.items = right ? [...data.items, ...moreItems] : [...moreItems, ...data.items];
      refreshCarousel();
    } catch (error) {
      console.error(error);
      toastError((error as PBError).message);
    } finally {
      isLoadingMore = false;
    }
  };
</script>

<div class="container">
  <section class="carousel">
    {#each carousel as item (item.id)}
      <figure class:current={item.id === data.currentId}>
        <img
          width={256}
          height={256}
          src={`${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}`}
          alt={item.id}
        />
        <figcaption>
          <div>
            <h1>{item.name}</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget rutrum erat, quis
              tristique magna. Etiam sit amet volutpat mauris. Pellentesque eu fermentum augue, eget
              porttitor ipsum. Vivamus porttitor erat lorem...
            </p>
            <aside>
              <span>Human</span>
              <span>Warlock</span>
            </aside>
          </div>
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
    position: relative;

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
        left: 125px;
      }

      button:last-child {
        right: 125px;
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

    section.carousel {
      display: flex;
      gap: 16px;
      background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
      padding: 16px 0;

      figure {
        position: relative;
        margin: 0;

        width: 256px;
        aspect-ratio: 1/1;
        overflow: hidden;
        user-select: none;

        img {
          width: 256px;
          aspect-ratio: 1/1;

          transition: all 0.5s ease-out;
          transform: scale3d(1, 1, 1);
        }

        figcaption {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;

          outline-color: color.adjust($text, $alpha: -0.5);
          outline-style: double;
          outline-width: 0px;
          outline-offset: -2px;
          transition: all 0.2s ease-out;
          transition-delay: 0.2s;

          div {
            position: absolute;
            padding: 16px;
            height: calc(100% - 2 * 16px);

            top: 76%;
            transition: all 0.4s ease-out;

            display: grid;
            grid-template-rows: 1fr 3fr auto;
            place-items: center;

            h1 {
              font-size: 1.5rem;
              margin: 0;
              text-shadow: 0px 0px 8px black;
            }

            p {
              font-size: 0.75rem;
              margin: 0;
            }

            aside {
              display: flex;
              gap: 8px;

              span {
                font-size: 0.75rem;
                padding: 4px 8px;
                border-radius: 12px;
                background-color: rgba(36, 19, 18, 0.9);
              }
            }
          }
        }
      }

      figure.current:hover {
        cursor: pointer;

        img {
          filter: brightness(0.4);
          transform: scale3d(1.1, 1.1, 1);
        }

        figcaption {
          outline-width: 2px;

          div {
            top: 0%;
          }
        }
      }
    }
  }
</style>
