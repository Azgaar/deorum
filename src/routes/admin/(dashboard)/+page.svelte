<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import AdminMenu from '$lib/components/editor/sidebar/AdminMenu.svelte';
  import SidePane from '$lib/components/editor/sidebar/SidePane.svelte';
  import { t } from '$lib/locales/translations';
  import type { PageData } from './$types';
  import CharactersBlock from './CharactersBlock.svelte';
  import ChartBlock from './ChartBlock.svelte';

  export let data: PageData;

  const { characters, profiles, customCharacters, uploadedPortraits } = data;
</script>

<div class="dashboard">
  <div class="container">
    <CharactersBlock header="Most liked characters" data={characters.mostLiked} />

    <ChartBlock header="Profiles created by date" data={profiles.createdByDate}>
      <div>Average registrations per day after release: {profiles.averagePerDay}</div>
      <div>Average registrations per day last week: {profiles.averageLastWeek}</div>
      <div>Profiles spending coins after release: {profiles.spendingCoins}%</div>
      <div>Profiles spending coins last week: {profiles.spendingCoinsLastWeek}%</div>
    </ChartBlock>

    <ChartBlock header="Custom characters created by date" data={customCharacters.createdByDate}>
      <div>
        Average custom characters created per day after release: {customCharacters.averagePerDay}
      </div>
      <div>
        Average custom characters created per day last week: {customCharacters.averageLastWeek}
      </div>
    </ChartBlock>

    <ChartBlock header="Portraits uploaded by users by date" data={uploadedPortraits.createdByDate}>
      <div>Average portraits uploaded per day after release: {uploadedPortraits.averagePerDay}</div>
      <div>Average portraits uploaded per day last week: {uploadedPortraits.averageLastWeek}</div>
    </ChartBlock>
  </div>
</div>

<SidePane>
  <AdminMenu page="admin.menu.dashboard">
    <BasicButton href="admin/portraits">
      {$t('admin.menu.portraits')}
    </BasicButton>

    <BasicButton href="admin/portraits/statistics">
      {$t('admin.menu.portraits')}
      {$t('admin.menu.statistics')}
    </BasicButton>

    <BasicButton href="admin/characters">
      {$t('admin.menu.characters')}
    </BasicButton>

    <BasicButton href="admin/characters/statistics">
      {$t('admin.menu.characters')}
      {$t('admin.menu.statistics')}
    </BasicButton>
  </AdminMenu>
</SidePane>

<style lang="scss">
  div.dashboard {
    position: relative;
    grid-area: content;
    overflow: hidden;

    background-color: $primary;

    &:before {
      content: '';
      background-image: url(/images/content.webp);
      background-size: cover;
      opacity: 0.3;
      position: absolute;
      inset: 0;
    }

    div.container {
      position: relative;
      height: 100%;
      overflow: auto;
    }
  }
</style>
