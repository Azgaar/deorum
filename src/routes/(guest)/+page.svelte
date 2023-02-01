<script lang="ts">
  import { t } from '$lib/locales/translations';
</script>

<main>
  <div>🚧 {$t('common.info.inDev')}</div>
</main>

<style lang="scss">
  @use 'sass:color';

  main {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      padding: 16px;
      background-color: color.adjust($primary, $alpha: -0.1, $lightness: -10%);
    }
  }
</style>
