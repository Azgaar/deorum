<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import DataTable, { Head, Body, Row, Cell, Label, Pagination } from '@smui/data-table';
  import IconButton from '@smui/icon-button';

  import { t } from '$lib/locales/translations';
  import Chips from '$lib/components/chips/NameChips.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import type { IListResult, IPortrait } from '$lib/types/api.types';

  export let data: { portraits: IListResult<IPortrait>; page: number };

  const { portraits, page } = data;

  let items = portraits.items || [];
  let selected: IPortrait[] = [];

  const start = (page - 1) * portraits.perPage;
  const end = start + items.length;
  const isLastPage = page === portraits.totalPages;

  let sort: keyof IPortrait = 'id';
  let sortDirection: 'ascending' | 'descending' | 'none' | 'other' | undefined = 'ascending';

  function handleSort() {
    items.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') return aVal.localeCompare(bVal);
      return Number(aVal) - Number(bVal);
    });

    items = items;
  }
</script>

<DataTable
  sortable
  bind:sort
  bind:sortDirection
  on:SMUIDataTable:sorted={handleSort}
  table$aria-label="Images"
  style="width: 100%; height: 100vh; overflow: auto;"
>
  <Head>
    <Row>
      <Cell checkbox>
        <Checkbox />
      </Cell>
      <Cell sortable={false} columnId="portrait">
        <Label>{$t('admin.editor.original')}</Label>
      </Cell>
      <Cell columnId="original">
        <Label>{$t('admin.editor.original')}</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="tags">
        <Label>{$t('admin.editor.tags')}</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="styles">
        <Label>{$t('admin.editor.styles')}</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="colors">
        <Label>{$t('admin.editor.colors')}</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell numeric columnId="quality">
        <IconButton class="material-icons">arrow_upward</IconButton>
        <Label>{$t('admin.editor.quality')}</Label>
      </Cell>
      <Cell sortable={false} />
    </Row>
  </Head>

  <Body>
    {#each items as item (item.id)}
      <Row>
        <Cell checkbox>
          <Checkbox bind:group={selected} value={item} valueKey={item.id} />
        </Cell>
        <Cell
          ><img
            loading="lazy"
            width="64px"
            height="64px"
            alt={item.original}
            src={`${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}?thumb=100x100`}
          />
        </Cell>
        <Cell style="text-transform: capitalize;">
          {$t(`admin.originals.${item['@expand'].original.name}`)}
        </Cell>
        <Cell><Chips chips={item['@expand'].tags} type="tags" /></Cell>
        <Cell><Chips chips={item['@expand'].styles} type="styles" /></Cell>
        <Cell>{item.colors.map((color) => $t(`admin.color.${color}`)).join(', ')}</Cell>
        <Cell numeric>{item.quality}</Cell>
        <Cell>
          <IconButton class="material-icons" title="Remove">delete</IconButton>
        </Cell>
      </Row>
    {/each}
  </Body>

  <Pagination slot="paginate">
    <svelte:fragment slot="total">
      {start + 1}-{end}
      {$t('admin.gallery.of')}
      {portraits.totalItems}
    </svelte:fragment>

    {#if page > 1}
      <IconButton class="material-icons" action="first-page" title="First page" href="./1">
        first_page
      </IconButton>
      <IconButton
        class="material-icons"
        action="prev-page"
        title="Prev page"
        href={`./${page - 1}`}
      >
        chevron_left
      </IconButton>
    {/if}

    {#if !isLastPage}
      <IconButton
        class="material-icons"
        action="next-page"
        title="Next page"
        href={`./${page + 1}`}
      >
        chevron_right
      </IconButton>

      <IconButton
        class="material-icons"
        action="last-page"
        title="Last page"
        href={`./${portraits.totalPages}`}
      >
        last_page
      </IconButton>
    {/if}
  </Pagination>
</DataTable>
