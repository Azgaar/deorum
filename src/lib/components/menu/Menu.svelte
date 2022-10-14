<script lang="ts">
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import SigninDialog from '$lib/components/auth/signin/SigninDialog.svelte';
  import SignupDialog from '$lib/components/auth/signup/SignupDialog.svelte';
  import Spinner from '$lib/components/spinner/Spinner.svelte';
  import { VERSION } from '$lib/constants';
  import { isLoading, user } from '$lib/stores';
  import { logout } from '$lib/api/auth';

  export let openFilters: () => void;

  let signin = false;
  let signup = false;

  const triggerUpload = () => {
    document.getElementById('filesInput')?.click();
  };

  const openStatistics = () => {
    window.location.href = '/admin/statistics/originals';
  };
</script>

<section class="menu">
  <header>
    <TextLogo size={64} />
    <Subtitle size={18}>{$t('admin.menu.subtitle')}</Subtitle>
    <Spinner hidden={!$isLoading} />
  </header>

  <main>
    {#if !$isLoading}
      <div class="hint">{$t('admin.menu.hint')}</div>

      {#if !$user}
        <Button variant="raised" on:click={() => (signin = true)}>
          <Label>{$t('common.auth.signin')}</Label>
        </Button>
        <SigninDialog bind:open={signin} />

        <Button variant="raised" on:click={() => (signup = true)}>
          <Label>{$t('common.auth.signup')}</Label>
        </Button>
        <SignupDialog bind:open={signup} />
      {/if}

      <Button variant="raised" on:click={openFilters}>
        <Label>{$t('admin.menu.filter')}</Label>
      </Button>

      <Button variant="raised" on:click={openStatistics}>
        <Label>{$t('admin.menu.statistics')}</Label>
      </Button>

      <Button variant="raised" on:click={triggerUpload}>
        <Label>{$t('admin.menu.upload')}</Label>
      </Button>

      {#if $user}
        <Button variant="raised" on:click={logout}>
          <Label>{$t('common.auth.logout')}</Label>
        </Button>
      {/if}
    {/if}
  </main>

  <footer>
    <span class="version">Azgaar, 2022, {$t('common.info.version')}{VERSION}</span>
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
    max-width: 400px;

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
