<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { IList } from '$lib/types/api.types';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import SelectionFilter from './filters/SelectionFilter.svelte';
  import TextFilter from './filters/TextFilter.svelte';
  import Item from './results/Item.svelte';
  import Pagination from './results/Pagination.svelte';

  export let isOpen: boolean;

  const pageSize = '6';
  let page = 1;
  let sorting: ISorting = { key: 'created', order: 'desc' };
  let filters: ICharacterFilters = {
    name: '',
    bio: '',
    gender: '',
    race: [],
    archetype: [],
    background: []
  };

  let results: IList<IGalleryItem>;

  const handlePageChange = (event: Event) => {
    const target = event.target as HTMLButtonElement;
    if (target.disabled || target.hasAttribute('aria-current')) event.preventDefault();

    const newPage = target.dataset.page;
    if (newPage !== undefined) {
      page = Number(newPage);
      handleApply(event);
    }
  };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = async (event: Event) => {
    event.preventDefault();

    try {
      const filter = parseFilters(filters);
      const sort = parseSorting(sorting);

      const searchParams = new URLSearchParams({ page: String(page), pageSize, filter, sort });
      const list = await request<IList<IGalleryItem>>(`/api/gallery/search?${searchParams}`);

      page = list.page;
      results = list;
    } catch (err) {
      report('admin', err, { request: 'searchCharacters' });
      toastError(err);
    }
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('common.search.title')}
  </DialogHeader>

  <form name="Search characters" on:submit={handleApply}>
    <DialogBody>
      <div class="parameters">
        <TextFilter entity="name" bind:filters bind:sorting />
        <TextFilter entity="bio" bind:filters bind:sorting />

        <SelectionFilter
          entity="race"
          dataPath="/api/races"
          translationPath="common.races"
          bind:filters
          bind:sorting
        />

        <SelectionFilter
          entity="archetype"
          dataPath="/api/archetypes"
          translationPath="common.archetypes"
          bind:filters
          bind:sorting
        />

        <SelectionFilter
          entity="background"
          dataPath="/api/backgrounds"
          translationPath="common.backgrounds"
          bind:filters
          bind:sorting
        />
      </div>

      {#if results?.items.length > 0}
        <div class="results">
          <div class="items">
            {#each results.items as item (item.id)}
              <Item {item} />
            {/each}
          </div>

          <div class="controls">
            <Pagination {page} pages={results.totalPages} onClick={handlePageChange} />
            <div>{$t('common.search.foundItems', { variable: results.totalItems })}</div>
          </div>
        </div>
      {/if}

      {#if results?.items.length === 0}
        <div class="noResults">{$t('common.search.noResults')}</div>
      {/if}
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.search')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  form {
    max-width: 400px;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.parameters {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    div.results {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      div.controls {
        font-size: 0.85em;

        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
    }

    div.noResults {
      font-size: 0.8rem;
    }
  }
</style>
