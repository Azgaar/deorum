<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';
  import { language } from '$lib/stores';

  // here will be a static site with the app description
</script>

<div class="root" lang={$language}>
  <main>
    <div>🚧 {$t('common.info.inDev')}</div>
  </main>
</div>

<style lang="scss">
  @use 'sass:color';

  div.root {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.webp');
    background-size: cover;
    background-position: center;

    display: flex;
    flex-direction: column;

    main {
      height: 100%;

      display: grid;
      grid-template-rows: 1fr 64px;
      align-items: center;
      justify-content: center;
      padding: 0 32px;

      div {
        padding: 16px;
        background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
      }
    }
  }
</style>
