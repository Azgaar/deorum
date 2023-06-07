<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { preloadData } from '$app/navigation';
  import { t } from '$lib/locales/translations';
  import { galleryId } from '$lib/stores';
  import { preloadImage, request } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  // preload gallery data and images
  onMount(async () => {
    try {
      const galleryItems = await request<IGalleryItem[]>(`/api/gallery/preload`);
      const nextId = galleryItems[2].id; // middle item
      galleryId.set(nextId);

      preloadData(`/gallery/${nextId}`);

      galleryItems.forEach((item) => {
        preloadImage(`${PORTRAITS_IMAGE_PATH}/${item.image}`);
      });
    } catch (error) {
      report('landing', error);
    }
  });
</script>

<main aria-label="landing page" transition:fade>
  <div class="content">
    <div class="title">
      <h1>{$t('common.landing.slogan')}</h1>
    </div>

    <div class="description">
      <p>{$t('common.landing.description1')}</p>
      <p>{$t('common.landing.description2')}</p>
    </div>

    <div class="controls">
      <a href={`/gallery/${$galleryId || ''}`}>{$t('common.landing.openGallery')}</a>
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    grid-area: main;
    overflow: hidden;

    $color-primary: #fdd8ae;
    $color-primary-dark: #bab45e;

    padding: 48px;

    @media ($mobile) {
      padding: 16px;
    }

    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      max-height: 100%;
      overflow: auto;

      padding: 24px;
      max-width: 1000px;
      background: linear-gradient(150deg, #160a05a4, #170904d9);
      border-radius: 8px;

      display: flex;
      flex-direction: column;
      gap: 8px;

      .title > h1 {
        margin: 8px;
        text-align: center;

        background: linear-gradient(45deg, $color-primary, $color-primary-dark);
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        font-size: 3rem;
        line-height: 1.2;
      }

      @media ($mobile) {
        padding: 8px 16px;

        .title > h1 {
          font-size: 1.5rem;
        }
      }

      .description {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        p {
          font-size: 1.4rem;
          line-height: 1.3;
        }

        @media ($mobile) {
          grid-template-columns: 1fr;
          gap: 8px;

          p {
            margin: 0;
            text-align: center;
            font-size: 1rem;
          }
        }
      }

      .controls {
        display: flex;
        justify-content: center;
        align-items: center;

        a {
          text-decoration: none;
          margin: 24px;
          padding: 12px 24px;

          @media ($mobile) {
            margin: 12px;
            padding: 6px 12px;
          }

          border-radius: 4px;
          background-color: $color-primary;

          font-size: 1.5rem;
          font-weight: 600;
          cursor: pointer;

          color: #170904;
          border: 2px solid $color-primary;
          transition: all 0.3s ease-in-out;

          &:hover {
            border-color: $color-primary-dark;
            color: $color-primary-dark;
            background-color: transparent;
          }
        }
      }
    }
  }
</style>
