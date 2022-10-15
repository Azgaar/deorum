<script lang="ts">
  import DataTable, { Head, Body, Row, Cell, Label } from '@smui/data-table';

  import { t } from '$lib/locales/translations';
  import Chips from '$lib/components/chips/StatChips.svelte';
  import { ORIGINALS_IMAGE_PATH } from '$lib/config';
  import type { IStatistics } from './+page.server';

  export let data: { statistics: IStatistics[] };
</script>

<DataTable table$aria-label="statistics">
  <Head>
    <Row>
      <Cell style="width: 64px"><Label>{$t('admin.editor.original')}</Label></Cell>
      <Cell style="width: auto"><Label>{$t('admin.editor.quality')}</Label></Cell>
      <Cell style="width: 50%"><Label>{$t('admin.editor.tags')}</Label></Cell>
      <Cell style="width: 20%"><Label>{$t('admin.editor.styles')}</Label></Cell>
      <Cell style="width: 15%"><Label>{$t('admin.editor.colors')}</Label></Cell>
      <Cell style="width: 20%"><Label>{$t('admin.editor.quality')}</Label></Cell>
    </Row>
  </Head>

  <Body style="white-space: normal;">
    {#each data.statistics as stats (stats.original.id)}
      <Row>
        <Cell
          ><img
            loading="lazy"
            width="64px"
            height="64px"
            alt={stats.original.name}
            src={`${ORIGINALS_IMAGE_PATH}/${stats.original.id}/${stats.original.image}?thumb=100x100`}
          />
        </Cell>
        <Cell style="text-transform: capitalize;">
          <div>{$t(`admin.originals.${stats.original.name}`)}</div>
          <div>{stats.portraits}</div>
        </Cell>
        <Cell><Chips chips={stats.tags} /></Cell>
        <Cell><Chips chips={stats.styles} /></Cell>
        <Cell><Chips chips={stats.colors} /></Cell>
        <Cell><Chips chips={stats.quality} /></Cell>
      </Row>
    {/each}
  </Body>
</DataTable>
