<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import DataTable, { Head, Body, Row, Cell, Label, Pagination } from '@smui/data-table';
  import IconButton from '@smui/icon-button';

  import Chips from '$lib/components/Chips.svelte';
  import { URL, colorsMap } from '$lib/config';

  import type { IListResult, IPortrait } from '$lib/api.types';

  export let data: {
    portraits: IListResult<IPortrait>;
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, string>;
    page: number;
  };

  const { portraits, tags, styles, originals, page } = data;
  let items = portraits.items || [];
  let selected: IPortrait[] = [];

  const start = (page - 1) * portraits.perPage;
  const end = start + items.length;
  const isLastPage = page === portraits.totalPages;

  const collectionId = items[0]?.['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;

  let sort: keyof IPortrait = 'id';
  let sortDirection: string = 'ascending';

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
  style="width: 100%; overflow: auto;"
>
  <Head>
    <Row>
      <Cell checkbox>
        <Checkbox />
      </Cell>
      <Cell sortable={false} columnId="image">
        <Label>Image</Label>
      </Cell>
      <Cell columnId="original">
        <Label>Original</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="tags">
        <Label>Tags</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="styles">
        <Label>Styles</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="colors">
        <Label>Colors</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell numeric columnId="quality">
        <IconButton class="material-icons">arrow_upward</IconButton>
        <Label>Quality</Label>
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
            alt={originals.get(item.original)}
            src={`${imagesPath}/${item.id}/${item.image}?thumb=100x100`}
          />
        </Cell>
        <Cell style="text-transform: capitalize;">{originals.get(item.original)}</Cell>
        <Cell><Chips chips={item.tags} map={tags} /></Cell>
        <Cell><Chips chips={item.styles} map={styles} /></Cell>
        <Cell><Chips chips={item.colors} map={colorsMap} /></Cell>
        <Cell numeric>{item.quality}</Cell>
        <Cell>
          <IconButton class="material-icons" title="Remove">delete</IconButton>
        </Cell>
      </Row>
    {/each}
  </Body>

  <Pagination slot="paginate">
    <svelte:fragment slot="total">
      {start + 1}-{end} of {portraits.totalItems}
    </svelte:fragment>

    <IconButton
      class="material-icons"
      action="first-page"
      title="First page"
      on:click={() => (window.location.href = './1')}
      disabled={page === 1}>first_page</IconButton
    >
    <IconButton
      class="material-icons"
      action="prev-page"
      title="Prev page"
      on:click={() => (window.location.href = `./${page - 1}`)}
      disabled={page === 1}>chevron_left</IconButton
    >
    <IconButton
      class="material-icons"
      action="next-page"
      title="Next page"
      on:click={() => (window.location.href = `./${page + 1}`)}
      disabled={isLastPage}>chevron_right</IconButton
    >
    <IconButton
      class="material-icons"
      action="last-page"
      title="Last page"
      on:click={() => (window.location.href = `./${portraits.totalPages}`)}
      disabled={isLastPage}>last_page</IconButton
    >
  </Pagination>
</DataTable>
