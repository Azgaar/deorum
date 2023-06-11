<script lang="ts">
  import { goto } from '$app/navigation';
  import GenderFilter from '$lib/components/filters/GenderFilter.svelte';
  import SelectionFilter from '$lib/components/filters/SelectionFilter.svelte';
  import TextFilter from '$lib/components/filters/TextFilter.svelte';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import { t } from '$lib/locales/translations';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';

  export let isOpen: boolean;
  export let filters: ICharacterFilters;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = async (event: Event) => {
    event.preventDefault();
    const params = new URLSearchParams({ sort: parseSorting(sorting) });
    parseFilters(filters).forEach((value) => params.append('filter', value));

    goto(`./characters/?${decodeURIComponent(params.toString())}`);
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
          translationPath="common.races"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="archetype"
          dataPath="/api/archetypes"
          translationPath="common.archetypes"
          bind:filters
          bind:sorting
          {defaultSorting}
        />

        <SelectionFilter
          entity="background"
          dataPath="/api/backgrounds"
          translationPath="common.backgrounds"
          bind:filters
          bind:sorting
          {defaultSorting}
        />
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
