<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IList } from '$lib/types/api.types';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import SelectionFilter from './filters/SelectionFilter.svelte';
  import TextFilter from './filters/TextFilter.svelte';

  export let isOpen: boolean;

  let sorting: ISorting = { key: 'created', order: 'desc' };
  let filters: ICharacterFilters = {
    name: '',
    bio: '',
    gender: '',
    race: ['byigyk8mmkjh63c', 'ozfm6jtt6c5qesi', 'ok3meeuvsbdsa0h'],
    archetype: [],
    background: []
  };

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = async (event: SubmitEvent) => {
    event.preventDefault();

    try {
      const filter = parseFilters(filters);
      const sort = parseSorting(sorting);

      const searchParams = new URLSearchParams({ page: '1', pageSize: '10', filter, sort });
      const data = await request<IList<ICharacter>>(`/api/characters?${searchParams}`);

      console.log(data);
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
    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.parameters {
      max-width: 400px;

      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
