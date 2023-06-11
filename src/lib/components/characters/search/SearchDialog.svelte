<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import GenderFilter from '$lib/components/filters/GenderFilter.svelte';
  import SelectionFilter from '$lib/components/filters/SelectionFilter.svelte';
  import TextFilter from '$lib/components/filters/TextFilter.svelte';
  import { t } from '$lib/locales/translations';
  import { hideLoadingOverlay, showLoadingOverlay, toastError } from '$lib/stores';
  import type { IList } from '$lib/types/api.types';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import {
    parseFilters,
    parseParamsToFilters,
    parseParamsToSorting,
    parseSorting
  } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import Item from './results/Item.svelte';
  import Pagination from './results/Pagination.svelte';

  export let isOpen: boolean;

  const pageSize = '5';
  let page = 1;

  const defaultFilters = { name: '', bio: '', gender: '', race: [], archetype: [], background: [] };
  const defaultSorting: ISorting = { key: 'id', order: 'desc' };
  const href = browser ? window.location.href : undefined;
  let filters = parseParamsToFilters<ICharacterFilters>(href, defaultFilters);
  let sorting = parseParamsToSorting(href, defaultSorting);

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
    showLoadingOverlay();

    try {
      const sort = parseSorting(sorting);
      const params = new URLSearchParams({ page: String(page), pageSize, sort });
      parseFilters(filters).forEach((value) => params.append('filter', value));
      const list = await request<IList<IGalleryItem>>(`/api/gallery/search?${params}`);

      page = list.page;
      results = list;
    } catch (err) {
      report('search', err, { request: 'searchCharacters' });
      toastError(err);
    } finally {
      hideLoadingOverlay();
    }
  };

  const handleOpenFilteredGallery = () => {
    if (!results?.items.length) return;

    const params = new URLSearchParams({ sort: parseSorting(sorting) });
    parseFilters(filters).forEach((value) => params.append('filter', value));

    const firstId = results.items[0].id;
    goto(`/gallery/${firstId}/?${decodeURIComponent(params.toString())}`);
    isOpen = false;
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('common.search.title')}
  </DialogHeader>

  <form name="Search characters" on:submit={handleApply}>
    <DialogBody>
      <div class="parameters">
        <TextFilter entity="name" bind:filters bind:sorting {defaultSorting} />
        <TextFilter entity="bio" bind:filters bind:sorting {defaultSorting} />

        <GenderFilter bind:filters bind:sorting {defaultSorting} />

        <SelectionFilter
          entity="race"
          dataPath="/api/races"
          titlePath="common.character.race"
          translationPath="common.races"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="archetype"
          dataPath="/api/archetypes"
          titlePath="common.character.archetype"
          translationPath="common.archetypes"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="background"
          dataPath="/api/backgrounds"
          titlePath="common.character.background"
          translationPath="common.backgrounds"
          bind:filters
          bind:sorting
          {defaultSorting}
        />
      </div>

      {#if results?.items.length > 0}
        <div class="results">
          <div class="items">
            {#each results.items as item (item.id)}
              <Item bind:isOpen {item} />
            {/each}
          </div>

          <div class="controls">
            <Pagination {page} pages={results.totalPages} onClick={handlePageChange} />

            <div>
              <div>{$t('common.search.foundItems', { variable: results.totalItems })}</div>

              <BasicButton
                style="text-decoration: underline; font-size: 1em; padding: 0;"
                variant="text"
                onClick={handleOpenFilteredGallery}
                disabled={!results || results.items.length < 5}
              >
                {$t('common.search.openGallery')}
              </BasicButton>
            </div>
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
    max-width: min(400px, 80vh);

    display: flex;
    flex-direction: column;
    gap: 1.2rem;

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

        div {
          display: flex;
          align-items: center;
          gap: 1rem;

          @media ($mobile) {
            font-size: 8px;
            flex-direction: column;
            align-items: flex-end;
            gap: 0rem;
          }
        }
      }
    }

    div.noResults {
      font-size: 0.8rem;
    }
  }
</style>
