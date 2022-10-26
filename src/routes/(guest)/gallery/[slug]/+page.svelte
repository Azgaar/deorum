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

<div class="container">
  <section class="carousel">
    {#each carousel as item}
      <figure class:current={item.id === data.currentId}>
        <img
          width={256}
          height={256}
          src={`${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}`}
          alt={item.id}
        />
        <figcaption>
          <div>
            <h1>Aurelia</h1>
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
    <svg viewBox="0 0 5 20">
      <path d="M5 0 L0 10 L5 20 Z" />
    </svg>

    <svg viewBox="0 0 5 20">
      <path d="M0 0 L5 10 L0 20 Z" />
    </svg>
  </div>
</div>

<style lang="scss">
  @use 'sass:color';
  div.container {
    position: relative;

    div.arrows {
      svg {
        position: absolute;
        width: 50px;
        aspect-ratio: 1/2;
        fill: $primary;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }

      svg:first-child {
        left: 125px;
      }

      svg:last-child {
        right: 125px;
      }

      svg:hover {
        fill: color.scale($primary, $lightness: 5%);
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
        cursor: pointer;
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
