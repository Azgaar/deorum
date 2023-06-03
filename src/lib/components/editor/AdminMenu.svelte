<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { logout } from '$lib/api/auth';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { t } from '$lib/locales/translations';

  export let openFilters: VoidFunction;

  let isPortraitsPage = browser ? window.location.pathname.includes('portraits') : true;
  let pageType = isPortraitsPage ? 'portraits' : 'characters';

  const handleLogout = () => {
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

    <BasicButton onClick={openFilters}>
      {$t('admin.menu.filter')}
    </BasicButton>

    {#if !isPortraitsPage}
      <BasicButton onClick={() => goto('./portraits')}>
        {$t('admin.menu.portraits')}
      </BasicButton>
    {/if}

    {#if isPortraitsPage}
      <BasicButton onClick={() => goto('./characters')}>
        {$t('admin.menu.characters')}
      </BasicButton>

      <BasicButton onClick={() => document.getElementById('uploadFilesInput')?.click()}>
        {$t('admin.menu.upload')}
      </BasicButton>

      <BasicButton onClick={() => goto(`./${pageType}/duplicates`)}>
        {$t('admin.menu.duplicates')}
      </BasicButton>
    {/if}

    <BasicButton onClick={() => goto(`./${pageType}/statistics`)}>
      {$t('admin.menu.statistics')}
    </BasicButton>

    {#if $page.data.role}
      <BasicButton onClick={handleLogout}>
        {$t('common.auth.logout')}
      </BasicButton>
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
