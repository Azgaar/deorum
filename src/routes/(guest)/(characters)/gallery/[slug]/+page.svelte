<script lang="ts">
  import Card from '$lib/components/characters/Card.svelte';
  import type { Carousel } from '$lib/components/characters/carousel';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { MOBILE_LAYOUT_MAX_WIDTH } from '$lib/config/view';
  import { t } from '$lib/locales/translations';
  import { toastInfo } from '$lib/stores';
  import { trimText } from '$lib/utils/string';
  import { getContext, onMount } from 'svelte';

  const carousel = getContext<Carousel>('carousel');
  const { carousel: items, currentItem: item } = carousel;
  const middleIndex = Math.floor($items.length / 2);

  onMount(() => {
    const storageKey = 'deorum-galleryTooltip-showed-times';
    const shownTimes = Number(localStorage.getItem(storageKey));
    if (shownTimes > 20) return;

    const isMobile = window.matchMedia(`(max-width: ${MOBILE_LAYOUT_MAX_WIDTH}px)`).matches;
    toastInfo(isMobile ? $t('common.gallery.mobileHint') : $t('common.gallery.desktopHint'));

    localStorage.setItem(storageKey, String(shownTimes + 1));
  });
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$item.name}`}
  description={trimText($item.bio, 250)}
  imageSrc={`${PORTRAITS_IMAGE_PATH}/${$item.image}`}
/>

<div class="wrapper">
  <section class="carousel">
    {#each $items as item, index (item.id)}
      <article
        aria-current={index === middleIndex}
        on:click={() => index !== middleIndex && carousel.move(index > middleIndex)}
        on:keydown={() => index !== middleIndex && carousel.move(index > middleIndex)}
      >
        <Card {item} actionable={item.id === carousel.currentId} />
      </article>
    {/each}
  </section>
</div>

<style lang="scss">
  @use 'sass:color';

  div.wrapper {
    width: 100%;
    height: 100%;
    user-select: none;
    display: flex;

    section.carousel {
      width: 100%;
      max-width: min(1800px, 85vw);
      min-height: 360px;
      z-index: 0;
      font-size: clamp(14px, 1vw, 24px);

      --item-width: clamp(300px, 25vw, 512px);
      --second-item-scale: 0.8;
      --third-item-scale: 0.5;
      --image-zoom: 1.4;

      @media ($mobile) {
        max-width: 320px;
      }

      position: relative;
      display: flex;
      align-items: center;
      margin: 0 auto;

      article {
        position: absolute;
        width: var(--item-width);
        z-index: 0;
        opacity: 0;

        transform: translateX(-50%) scale(1);
        transition: all 0.3s ease-in-out;

        &:nth-child(1),
        &:nth-child(5) {
          transform: translateX(-50%) scale(var(--third-item-scale));
          opacity: 0.4;
          animation: fadeIn04 0.3s ease-in-out;
          cursor: pointer;

          @keyframes fadeIn04 {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.4;
            }
          }
        }

        &:nth-child(2),
        &:nth-child(4) {
          transform: translateX(-50%) scale(var(--second-item-scale));
          z-index: 1;
          opacity: 0.9;
          cursor: pointer;
        }

        &:nth-child(1) {
          left: 15%;
        }

        &:nth-child(2) {
          left: 30%;
        }

        &:nth-child(3) {
          left: 50%;
          z-index: 2;
          box-shadow: 0 0 30px rgb(black, 0.6), 0 0 60px rgb(black, 0.45),
            0 0 110px rgb(black, 0.25), 0 0 100px rgb(black, 0.1);
          opacity: 1;
        }

        &:nth-child(4) {
          left: 70%;
        }

        &:nth-child(5) {
          left: 85%;
        }
      }
    }
  }
</style>
