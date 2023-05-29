<script lang="ts">
  import Chips from '$lib/components/chips/StatsChips.svelte';
  import Cell from '$lib/components/table/Cell.svelte';
  import Row from '$lib/components/table/Row.svelte';
  import Table from '$lib/components/table/Table.svelte';
  import { t } from '$lib/locales/translations';

  export let data: import('./$types').PageData;

  const translate = (type: string) => (key: string) => $t(`admin.${type}.${key}`);
</script>

<Table ariaLabel="Portraits statistics">
  <colgroup>
    <col style="width: 64px" />
    <col style="width: auto" />
    <col style="width: 50%" />
    <col style="width: 20%" />
    <col style="width: 15%" />
    <col style="width: 20%" />
  </colgroup>

  <thead>
    <Row head>
      <Cell>{$t('admin.editor.original')}</Cell>
      <Cell />
      <Cell>{$t('admin.editor.tags')}</Cell>
      <Cell>{$t('admin.editor.styles')}</Cell>
      <Cell>{$t('admin.editor.colors')}</Cell>
      <Cell>{$t('admin.editor.quality')}</Cell>
    </Row>
  </thead>

  <tbody>
    {#each data.statistics as stats (stats.original.id)}
      <Row>
        <Cell>
          <img
            loading="lazy"
            width="64px"
            height="64px"
            alt={stats.original.name}
            src={stats.original.image}
          />
        </Cell>
        <Cell style="text-transform: capitalize;">
          <div>{$t(`admin.originals.${stats.original.name}`)}</div>
          <div>{$t('admin.statistics.portraits')}: {stats.original.count}</div>
          <div>{$t('admin.statistics.averageQuality')}: {stats.averageQuality.toFixed(1)}</div>
        </Cell>
        <Cell><Chips chips={stats.tags} translate={translate('tags')} /></Cell>
        <Cell><Chips chips={stats.styles} translate={translate('styles')} /></Cell>
        <Cell><Chips chips={stats.colors} translate={translate('colors')} /></Cell>
        <Cell><Chips chips={stats.quality} /></Cell>
      </Row>
    {/each}
  </tbody>
</Table>
