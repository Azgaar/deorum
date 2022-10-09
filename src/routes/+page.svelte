<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
</script>

<body>
  <Header />

  <main>
    <div>🚧 {$t('common.info.inDev')}</div>
  </main>

  <Footer />
</body>

<style lang="scss">
  @use 'sass:color';

  body {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.png');
    background-size: cover;
    background-position: center;

    display: flex;
    flex-direction: column;
  }

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
</style>
