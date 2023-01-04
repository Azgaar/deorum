<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';
  import { VERSION } from '$lib/constants';

  const appName = 'Deorum: Fantasy Character Creator';
  const author = 'Azgaar';
  const year = new Date().getFullYear();
</script>

<footer>
  <span class="version">{appName}. {author}, {year}. {$t('common.info.version')}{VERSION}</span>
</footer>

<style lang="scss">
  footer {
    height: 58px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    .version {
      padding: 10px 16px;
      font-style: italic;
      font-size: 10px;
      color: $text;
      opacity: 0.1;
    }
  }
</style>
