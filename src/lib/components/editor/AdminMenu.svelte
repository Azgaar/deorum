<script lang="ts">
  import { goto } from '$app/navigation';
  import { logout } from '$lib/api/auth';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { t } from '$lib/locales/translations';

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

    <slot />

    <BasicButton onClick={handleLogout}>
      {$t('common.auth.logout')}
    </BasicButton>
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
        background-color: rgb($surface, 0.4);
        border-radius: 4px;
      }
    }
  }
</style>
