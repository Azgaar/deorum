<script lang="ts">
  import { t } from '$lib/locales/translations';
</script>

<main>
  <div class="content">
    <div class="title">
      <h1>{$t('common.landing.slogan')}</h1>
    </div>

    <div class="description">
      <p>{$t('common.landing.description1')}</p>
      <p>{$t('common.landing.description2')}</p>
    </div>

    <div class="controls">
      <a href="/gallery" data-sveltekit-preload-data>
        {$t('common.landing.openGallery')}
      </a>
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    $color-primary: #fdd8ae;
    $color-primary-dark: #bab45e;

    padding: 48px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .content {
      padding: 24px;
      max-width: 1000px;
      background-color: #170904d9;

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

      .description {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        p {
          font-size: 1.5rem;
          line-height: 1.4;
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
