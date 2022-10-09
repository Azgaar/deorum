<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';

  import { VERSION } from '$lib/constants';
</script>

<footer>
  <span class="version">Azgaar, 2022, {$t('common.info.version')}{VERSION}</span>
</footer>

<style lang="scss">
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
