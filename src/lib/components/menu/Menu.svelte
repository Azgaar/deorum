<script lang="ts">
  import { t } from '$lib/locales/translations';
  import Button, { Label } from '@smui/button';

  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import { VERSION } from '$lib/constants';

  export let openFilters: () => void;

  const triggerUpload = () => {
    document.getElementById('filesInput')?.click();
  };
</script>

<section class="menu">
  <header>
    <TextLogo size={64} />
    <Subtitle size={18}>{$t('admin.menu.subtitle')}</Subtitle>
  </header>

  <main>
    <div class="hint">{$t('admin.menu.hint')}</div>

    <Button variant="raised" on:click={openFilters}>
      <Label>{$t('admin.menu.filter')}</Label>
    </Button>

    <Button variant="raised" on:click={triggerUpload}>
      <Label>{$t('admin.menu.upload')}</Label>
    </Button>
  </main>

  <footer>
    <span class="version">Azgaar, 2022, {$t('admin.info.version')}{VERSION}</span>
  </footer>
</section>

<style lang="scss">
  .menu {
    display: grid;
    grid-template-rows: auto 4fr 1fr;
    align-items: center;
    padding: 8px;
    text-align: center;
    height: 100%;

    @media (max-width: 599px) {
      height: auto;
    }

    main {
      display: flex;
      flex-direction: column;
      gap: 12px;

      div.hint {
        padding: 4px 24px;
        font-size: 14px;
        font-style: italic;
        background-color: rgba($surface, 0.4);
        border-radius: 4px;
      }
    }

    footer {
      align-self: flex-end;
      justify-self: end;

      .version {
        color: $secondary;
        opacity: 0.5;
        font-size: 8px;
        font-style: italic;
        margin-right: 12px;
      }
    }
  }
</style>
