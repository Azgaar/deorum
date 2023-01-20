<script lang="ts" context="module">
  import { t } from '$lib/locales/translations';
  import { VERSION } from '$lib/constants';

  const appNameFull = 'Deorum: Fantasy Character Creator';
  const appNameShort = 'Deorum';
  const author = 'Azgaar';
  const year = new Date().getFullYear();
</script>

<footer>
  <span class="version desktop"
    >{appNameFull}. {author}, {year}. {$t('common.info.version')}{VERSION}</span
  >
  <span class="version mobile">{appNameShort} {$t('common.info.version')}{VERSION}</span>
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

  @media ($desktop) {
    .mobile {
      display: none;
    }

    .desktop {
      display: block;
    }
  }

  @media ($mobile) {
    .mobile {
      display: block;
    }

    .desktop {
      display: none;
    }
  }
</style>
