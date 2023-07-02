<script lang="ts">
  import Sorting from '$lib/components/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ISorting, TSelectElement } from '$lib/types/filters.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import SelectionDialog from './SelectionDialog.svelte';
  import SelectionElement from './SelectionElement.svelte';

  export let key: 'name' | 'id' = 'id';
  export let entity:
    | 'race'
    | 'archetype'
    | 'background'
    | 'original'
    | 'colors'
    | 'tags'
    | 'styles';
  export let type: 'image' | 'text';
  export let dataPath: string;
  export let titlePath: string;
  export let translationPath: string;
  export let filters: object;
  export let sorting: ISorting;
  export let defaultSorting: ISorting;
  export let columns = 4;

  let isOpen = false;

  let data: TSelectElement[] = [];

  $: title = $t(`common.controls.select`) + ' ' + $t(titlePath);
  $: selected = (filters as Record<string, string[]>)[entity];
  $: elements = selected
    .map((item) => data.find((element) => element[key] === item))
    .filter((el): el is NonNullable<TSelectElement> => Boolean(el));

  loadData();
  async function loadData() {
    try {
      data = await request(dataPath);
    } catch (error) {
      report('selection filter', error);
      toastError(error);
    }
  }

  const hadleSubmit = (selected: string[]) => {
    (filters as Record<string, string[]>)[entity] = selected;
  };

  const createDeleteHandler = (key: string) => () => {
    (filters as Record<string, string[]>)[entity] = selected.filter((item) => item !== key);
  };
</script>

<div aria-label={`Filter by ${entity}`} class="filter" class:inactive={!selected.length}>
  <Sorting key={entity} bind:sorting {defaultSorting} />
  <span>{$t(titlePath)}:</span>
  <div class="elements">
    {#each elements as element (element.id)}
      <SelectionElement {element} onDelete={createDeleteHandler(element.id)} {translationPath} />
    {/each}
  </div>
  <button type="button" class="edit" on:click={() => (isOpen = true)}>⚙️</button>
</div>

{#if isOpen}
  <SelectionDialog
    bind:isOpen
    {type}
    {key}
    {title}
    {data}
    {translationPath}
    {selected}
    onSubmit={hadleSubmit}
    {columns}
  />
{/if}

<style lang="scss">
  div.filter {
    position: relative;
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr 2fr 20px;
    gap: 0.5em;

    &.inactive > span {
      color: rgb($text, 0.2);
    }

    .elements {
      display: flex;
      flex-wrap: wrap;
      gap: 1px 3px;
    }

    .edit {
      background: none;
      border: none;
      cursor: pointer;

      padding: 0;
      width: 20px;
      height: 20px;
    }
  }
</style>
