<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import AdminEditorDialog from '$lib/components/characters/editor/admin/AdminEditorDialog.svelte';
  import AdminMenu from '$lib/components/editor/AdminMenu.svelte';
  import GenericDialog from '$lib/components/editor/genericDialog/GenericDialog.svelte';
  import CharacterEditor from '$lib/components/editor/sidebar/CharacterEditor.svelte';
  import { PORTRAITS_IMAGE_PATH, charactersConfig } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IList, IPortrait } from '$lib/types/api.types';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import {
    parseFilters,
    parseParamsToFilters,
    parseParamsToSorting,
    parseSorting
  } from '$lib/utils/filters';
  import { debounce } from '$lib/utils/funtional';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import GalleryImage from '../GalleryImage.svelte';
  import Grid from '../Grid.svelte';
  import LoadMore from '../LoadMore.svelte';
  import type { PageData } from './$types';
  import FilterCharactersDialog from './FilterCharactersDialog.svelte';

  export let data: PageData;

  // incoming data: immutable, turn arrays into maps
  const races = new Map(data.races.map((race) => [race.id, race]));
  const archetypes = new Map(data.archetypes.map(({ id, name }) => [id, { name }]));
  const backgrounds = new Map(data.backgrounds.map(({ id, name }) => [id, { name }]));
  const tags = new Map(data.tags.map(({ id, name, image }) => [id, { name, image }]));

  // incoming data: mutable
  let { page, pageSize, hasMore } = data;

  // reactive data
  let selected: string[] = [];
  $: characters = data.characters || [];
  $: charactersMap = new Map(characters.map((char) => [char.id, char]));
  $: model = getModel(selected);

  const getModel = (selected: string[]) => {
    if (!selected.length) return null;
    return charactersMap.get(selected[0]);
  };

  // filters data
  let isFilterDialogOpen = false;
  const defaultFilters = { name: '', bio: '', gender: '', race: [], archetype: [], background: [] };
  const defaultSorting: ISorting = { key: 'created', order: 'desc' };
  const href = browser ? window.location.href : undefined;
  let filters = parseParamsToFilters<ICharacterFilters>(href, defaultFilters);
  let sorting = parseParamsToSorting(href, defaultSorting);

  const handleClick = (e: Event) => {
    const figure = (e.target as HTMLElement).closest('figure');
    const id = figure?.dataset.id;
    if (!id) return;

    if (selected.includes(id)) {
      selected = selected.filter((item) => item !== id);
      return;
    }

    if ((e as KeyboardEvent).shiftKey || selected.length > 1) {
      selected = [...selected, id];
    } else {
      selected = [id];
    }
  };

  let isMouseDown = false;
  const handleMousemove = debounce((e: Event) => {
    if (!isMouseDown) return;

    const figure = (e.target as HTMLElement).closest('figure');
    const id = figure?.dataset.id;
    if (!id) return;

    if (selected.includes(id)) return;
    selected = [...selected, id];
  }, 5);

  const handleLoadMore = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        pageSize: String(pageSize),
        sort: parseSorting(sorting),
        expand: charactersConfig.expand
      });
      parseFilters(filters).forEach((value) => params.append('filter', value));
      const charactersList = await request<IList<ICharacter>>(`/api/characters?${params}`);

      page += 1;
      hasMore = page < charactersList.totalPages;
      data.characters = [...data.characters, ...charactersList.items];
    } catch (err) {
      report('admin', err, 'load more');
      toastError(err);
    }
  };

  const handleClearSelection = () => {
    selected = [];
  };

  const getMainImage = (item: ICharacter) => {
    const portraits = item['@expand'].portraits as IPortrait[];
    if (!portraits?.length) return '';

    const { id, image } = portraits[0];
    return `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  };

  let genericDialogData = {
    isOpen: false,
    key: '',
    entries: [] as [string, { image: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const openEditorDialog: TOpenEditorDialog = (key, entries, selected, onSubmit) => {
    genericDialogData = { isOpen: true, key, entries, selected, onSubmit };
  };

  let editCharacterDialogData = {
    open: false,
    character: {} as ICharacter,
    onSubmit: (_: ICharacter) => {},
    onDelete: (_: string) => {},
    portraitIds: [] as string[],
    races,
    archetypes,
    backgrounds,
    tags,
    openEditorDialog
  };

  const createEditHandler = (model: ICharacter) => () => {
    const onSubmit = (updateCharacter: ICharacter) => {
      data.characters = data.characters.map((char) =>
        char.id === updateCharacter.id ? updateCharacter : char
      );
      selected = selected;
    };

    const onDelete = (characterId: string) => {
      data.characters = data.characters.filter(({ id }) => id !== characterId);
      selected = [];
    };

    editCharacterDialogData = {
      ...editCharacterDialogData,
      open: true,
      portraitIds: model.portraits,
      character: model,
      onSubmit,
      onDelete
    };
  };
</script>

<section
  class="gallery"
  on:click={handleClick}
  on:keydown={handleClick}
  on:mousedown={() => (isMouseDown = true)}
  on:mouseup={() => (isMouseDown = false)}
  on:mousemove={handleMousemove}
>
  <Grid>
    {#each characters as item (item.id)}
      <GalleryImage id={item.id} src={getMainImage(item)} isSelected={selected.includes(item.id)} />
    {/each}
  </Grid>

  {#if characters.length === 0}
    <div>No characters found, try to change filter criteria</div>
  {/if}

  {#if hasMore}
    <LoadMore onClick={handleLoadMore} />
  {/if}
</section>

<aside class="pane">
  {#if model}
    <div class="paneHeader">
      <CharacterEditor
        {model}
        {races}
        {archetypes}
        {backgrounds}
        {handleClearSelection}
        image={getMainImage(model)}
        selectedImages={selected.length}
        handleEdit={createEditHandler(model)}
      />
    </div>
  {:else}
    <AdminMenu>
      <BasicButton onClick={() => (isFilterDialogOpen = true)}>
        {$t('admin.menu.filter')}
      </BasicButton>

      <BasicButton onClick={() => goto('./portraits')}>
        {$t('admin.menu.portraits')}
      </BasicButton>

      <BasicButton onClick={() => goto(`./characters/statistics`)}>
        {$t('admin.menu.statistics')}
      </BasicButton>
    </AdminMenu>
  {/if}
</aside>

{#if editCharacterDialogData.open}
  <AdminEditorDialog {...editCharacterDialogData} bind:isOpen={editCharacterDialogData.open} />
{/if}

<GenericDialog {...genericDialogData} />
<FilterCharactersDialog bind:isOpen={isFilterDialogOpen} {filters} {sorting} {defaultSorting} />

<style lang="scss">
  @use 'sass:color';

  section.gallery {
    grid-area: gallery;
    width: 100%;
    overflow: auto;
  }

  aside.pane {
    grid-area: pane;
    background-image: url('/images/menu.webp');
    background-size: 100% 100%;
    overflow: hidden;

    display: flex;
    justify-content: center;

    @media ($mobile) {
      display: flex;
      justify-content: center;
      padding: 1rem 2rem;
      width: auto;
    }
  }
</style>
