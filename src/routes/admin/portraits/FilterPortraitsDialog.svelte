<script lang="ts">
  import { goto } from '$app/navigation';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import HasCharactersFilter from '$lib/components/filters/HasCharactersFilter.svelte';
  import QualityFilter from '$lib/components/filters/QualityFilter.svelte';
  import SelectionFilter from '$lib/components/filters/SelectionFilter.svelte';
  import { t } from '$lib/locales/translations';
  import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';

  export let isOpen: boolean;
  export let filters: IPortraitFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = async (event: Event) => {
    event.preventDefault();
    const params = new URLSearchParams({ sort: parseSorting(sorting) });
    parseFilters(filters).forEach((value) => params.append('filter', value));

    goto(`./portraits/?${decodeURIComponent(params.toString())}`);
    isOpen = false;
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('admin.menu.filter')}
    {$t('admin.menu.portraits')}
  </DialogHeader>

  <form name="Filter portraits" on:submit={handleApply}>
    <DialogBody>
      <div class="parameters">
        <QualityFilter bind:filters bind:sorting {defaultSorting} />

        <SelectionFilter
          entity="original"
          dataPath="/api/originals"
          titlePath="admin.editor.originals"
          translationPath="admin.originals"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="color"
          dataPath="/api/colors"
          titlePath="admin.editor.colors"
          translationPath="admin.colors"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="tag"
          dataPath="/api/tags"
          titlePath="admin.editor.tags"
          translationPath="admin.tags"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="style"
          dataPath="/api/styles"
          titlePath="admin.editor.styles"
          translationPath="admin.styles"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <HasCharactersFilter bind:filters />
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
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
  }
</style>
