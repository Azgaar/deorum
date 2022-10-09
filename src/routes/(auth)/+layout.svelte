<script lang="ts" context="module">
  import Snackbar from '$lib/components/snackbar/Snackbar.svelte';

  import { t } from '$lib/locales/translations';
  import Header from '$lib/components/header/Header.svelte';
  import { VERSION } from '$lib/constants';
</script>

<head>
  <title>Deorum</title>
</head>

<body>
  <Header />

  <main>
    <div>
      <slot />
    </div>
    <Snackbar />
  </main>

  <footer>
    <span class="version">Azgaar, 2022, {$t('common.info.version')}{VERSION}</span>
  </footer></body
>

<style lang="scss">
  @use 'sass:color';

  body {
    height: 100vh;
    overflow: hidden;

    background-image: url('/images/background.png');
    background-size: 100% 100%;

    display: flex;
    flex-direction: column;
  }

  main {
    height: 100%;

    display: grid;
    grid-template-rows: 1fr 32px;
    align-items: center;
    justify-content: center;
    padding: 0 32px;

    div {
      padding: 16px 0px;
      background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
    }
  }

  footer {
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px;

    .version {
      font-size: 12px;
      color: $text;
      opacity: 0.3;
    }
  }
</style>
