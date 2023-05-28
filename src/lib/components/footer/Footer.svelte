<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';
  import { VERSION } from '$lib/config/constants';

  const appNameFull = 'Deorum: fantasy characters creator by Azgaar';
  const year = new Date().getFullYear();
</script>

<footer>
  <span class="version">{appNameFull}, {year}. {$t('common.info.version')}{VERSION}</span>
</footer>

<style lang="scss">
  footer {
    pointer-events: none;

    height: 48px;
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

  @media ($mobile) {
    footer {
      height: 12px;

      .version {
        padding: 2px 16px;
        font-size: 8px;
      }
    }
  }
</style>
