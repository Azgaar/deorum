<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import SigninDialog from '$lib/components/auth/signin/SigninDialog.svelte';
  import SignupDialog from '$lib/components/auth/signup/SignupDialog.svelte';
  import { VERSION } from '$lib/config/constants';

  import { logout } from '$lib/api/auth';
  import { browser } from '$app/environment';

  export let openFilters: VoidFunction;

  let signin = false;
  let signup = false;

  let isPortraitsPage = browser ? window.location.pathname.includes('portraits') : true;
  let pageType = isPortraitsPage ? 'portraits' : 'characters';
</script>

<section class="menu">
  <header>
    <TextLogo size={56} />
    <Subtitle size={18}>{$t('admin.menu.subtitle')}</Subtitle>
  </header>

  <main>
    <div class="hint">{$t('admin.menu.hint')}</div>

    {#if !$page.data.role}
      <Button variant="raised" on:click={() => (signin = true)}>
        <Label>{$t('common.auth.signin')}</Label>
      </Button>
      <SigninDialog bind:isOpen={signin} />

      <Button variant="raised" on:click={() => (signup = true)}>
        <Label>{$t('common.auth.signup')}</Label>
      </Button>
      <SignupDialog bind:open={signup} />
    {/if}

    <Button variant="raised" on:click={openFilters}>
      <Label>{$t('admin.menu.filter')}</Label>
    </Button>

    {#if !isPortraitsPage}
      <Button variant="raised" on:click={() => goto('./portraits')}>
        {$t('admin.menu.portraits')}
      </Button>
    {/if}

    {#if isPortraitsPage}
      <Button variant="raised" on:click={() => goto(`./${pageType}/duplicates`)}>
        {$t('admin.menu.duplicates')}
      </Button>

      <Button variant="raised" on:click={() => goto('./characters')}>
        {$t('admin.menu.characters')}
      </Button>
    {/if}

    <Button variant="raised" on:click={() => goto(`./${pageType}/statistics`)}>
      <Label>{$t('admin.menu.statistics')}</Label>
    </Button>

    <Button variant="raised" on:click={() => document.getElementById('uploadFilesInput')?.click()}>
      <Label>{$t('admin.menu.upload')}</Label>
    </Button>

    {#if $page.data.role}
      <Button variant="raised" on:click={logout}>
        <Label>{$t('common.auth.logout')}</Label>
      </Button>
    {/if}
  </main>

  <footer>
    <span class="version">Azgaar, 2022, {$t('common.info.version')}{VERSION}</span>
  </footer>
</section>

<style lang="scss">
  .menu {
    padding: 3rem 2rem;
    height: 100%;
    max-width: 400px;

    display: grid;
    grid-template-rows: auto 4fr 1fr;
    align-items: center;
    text-align: center;

    @media ($mobile) {
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
