<script lang="ts">
  import { page } from '$app/stores';
  import Search from '$lib/components/characters/search/Search.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import AnonymMenu from './anonymMenu/AnonymMenu.svelte';
  import QuickActionsMenu from './quickActionsMenu/QuickActionsMenu.svelte';
  import UserMenu from './userMenu/UserMenu.svelte';
</script>

<header>
  <TextLogo size={42} />

  <div class="right-panel noprint">
    <Search />
    <QuickActionsMenu />

    {#if $page.data.userId}
      <UserMenu />
    {:else}
      <AnonymMenu />
    {/if}
  </div>
</header>

<style lang="scss">
  @use 'sass:color';

  header {
    height: 48px;
    background-color: color.adjust(black, $alpha: -0.8);

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 1em;
    padding: 0 32px;

    @media ($mobile) {
      font-size: 0.9em;
      padding: 0 8px;
    }

    div.right-panel {
      display: flex;
      align-items: center;
      gap: 8px;

      @media ($mobile) {
        gap: 2px;
      }
    }
  }
</style>
