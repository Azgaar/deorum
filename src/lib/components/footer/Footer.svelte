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
    padding: 10px 16px;

    .version {
      font-style: italic;
      font-size: 10px;
      color: $text;
      opacity: 0.1;
    }
  }
</style>
