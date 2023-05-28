<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { logout } from '$lib/api/auth';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { VERSION } from '$lib/config/constants';
  import { t } from '$lib/locales/translations';
  import Button, { Label } from '@smui/button';

  export let openFilters: VoidFunction;

  let isPortraitsPage = browser ? window.location.pathname.includes('portraits') : true;
  let pageType = isPortraitsPage ? 'portraits' : 'characters';

  const hadndleLogout = () => {
    logout();
    goto('/signin', { invalidateAll: true });
  };
</script>

<menu>
  <header>
    <TextLogo size={56} />
    <Subtitle size={18}>{$t('admin.menu.subtitle')}</Subtitle>
  </header>

  <main>
    <div class="hint">{$t('admin.menu.hint')}</div>

    <Button variant="raised" on:click={openFilters}>
      <Label>{$t('admin.menu.filter')}</Label>
    </Button>

    {#if !isPortraitsPage}
      <Button variant="raised" on:click={() => goto('./portraits')}>
        {$t('admin.menu.portraits')}
      </Button>
    {/if}

    {#if isPortraitsPage}
      <Button variant="raised" on:click={() => goto('./characters')}>
        {$t('admin.menu.characters')}
      </Button>

      <Button
        variant="raised"
        on:click={() => document.getElementById('uploadFilesInput')?.click()}
      >
        <Label>{$t('admin.menu.upload')}</Label>
      </Button>

      <Button variant="raised" on:click={() => goto(`./${pageType}/duplicates`)}>
        {$t('admin.menu.duplicates')}
      </Button>
    {/if}

    <Button variant="raised" on:click={() => goto(`./${pageType}/statistics`)}>
      <Label>{$t('admin.menu.statistics')}</Label>
    </Button>

    {#if $page.data.role}
      <Button variant="raised" on:click={hadndleLogout}>
        <Label>{$t('common.auth.logout')}</Label>
      </Button>
    {/if}
  </main>
</menu>

<style lang="scss">
  menu {
    padding: 3rem 2rem;
    max-width: 400px;

    @media ($mobile) {
      padding: 0 2rem;
    }

    display: grid;
    grid-template-rows: auto 1fr;
    align-items: center;
    text-align: center;

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
  }
</style>
