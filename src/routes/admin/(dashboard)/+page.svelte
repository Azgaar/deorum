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
    <CharactersBlock
      header={$t('admin.dashboard.mostLikedCharacters')}
      data={characters.mostLiked}
    />

    <CharactersBlock
      header={$t('admin.dashboard.leastLikedCharacters')}
      data={characters.leastLiked}
    />

    <ChartBlock header={$t('admin.dashboard.profilesCreatedByDate')} data={profiles.createdByDate}>
      <div>{$t('admin.dashboard.averageRegistrationsPerDay')}: {profiles.averagePerDay}</div>
      <div>
        {$t('admin.dashboard.averageRegistrationsPerDayLastWeek')}: {profiles.averageLastWeek}
      </div>
      <div>{$t('admin.dashboard.profilesSpendingCoins')}: {profiles.spendingCoins}%</div>
      <div>
        {$t('admin.dashboard.profilesSpendingCoinsLastWeek')}: {profiles.spendingCoinsLastWeek}%
      </div>
    </ChartBlock>

    <ChartBlock
      header={$t('admin.dashboard.customCharactersCreatedByDate')}
      data={customCharacters.createdByDate}
    >
      <div>
        {$t('admin.dashboard.averagCustomCharactersCreatedPerDay')}: {customCharacters.averagePerDay}
      </div>
      <div>
        {$t('admin.dashboard.averagCustomCharactersCreatedPerDayLastWeek')}: {customCharacters.averageLastWeek}
      </div>
    </ChartBlock>

    <ChartBlock
      header={$t('admin.dashboard.portraitsUploadedByUsersByDate')}
      data={uploadedPortraits.createdByDate}
    >
      <div>
        {$t('admin.dashboard.averagePortraitsUploadedPerDay')}: {uploadedPortraits.averagePerDay}
      </div>
      <div>
        {$t('admin.dashboard.averagePortraitsUploadedPerDayLastWeek')}: {uploadedPortraits.averageLastWeek}
      </div>
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
