<script lang="ts">
  import { browser } from '$app/environment';
  import Card from '$lib/components/characters/Card.svelte';
  import type { Carousel } from '$lib/components/characters/carousel';
  import { t } from '$lib/locales/translations';
  import { toastInfo } from '$lib/stores';
  import { getContext, onMount } from 'svelte';

  const carousel = getContext<Carousel>('carousel');
  const items = carousel.carousel;

  const handleClick = (id: string) => () => {
    if (id === carousel.currentId) return;
    carousel.move(id > carousel.currentId);
  };

  onMount(() => {
    const storageKey = 'deorum-galleryTooltip-showed-times';
    const shownTimes = Number(localStorage.getItem(storageKey));
    if (shownTimes > 20) return;

    const isMobile = window.matchMedia('(max-width: 599px)').matches;
    toastInfo(isMobile ? $t('common.gallery.mobileHint') : $t('common.gallery.desktopHint'));

    localStorage.setItem(storageKey, String(shownTimes + 1));
  });
</script>

<div class="wrapper">
  <section class="carousel">
    {#each $items as item (item.id)}
      <div class="item" on:click={handleClick(item.id)} on:keydown={handleClick(item.id)}>
        <Card {item} actionable={item.id === carousel.currentId} />
      </div>
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

      .item:nth-child(2),
      .item:nth-child(4) {
        transform: translateX(-50%) scale(var(--second-item-scale));
        z-index: 1;
        opacity: 0.9;
        cursor: pointer;
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
