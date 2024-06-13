<script lang="ts">
  import { browser } from '$app/environment';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import AdminEditorDialog from '$lib/components/characters/editor/admin/AdminEditorDialog.svelte';
  import SelectCharacterDialog from '$lib/components/characters/editor/admin/SelectCharacterDialog.svelte';
  import GenericDialog from '$lib/components/editor/genericDialog/GenericDialog.svelte';
  import OriginalsDialog from '$lib/components/editor/originalsDialog/OriginalsDialog.svelte';
  import AdminMenu from '$lib/components/editor/sidebar/AdminMenu.svelte';
  import PortraitEditor from '$lib/components/editor/sidebar/PortraitEditor.svelte';
  import SidePane from '$lib/components/editor/sidebar/SidePane.svelte';
  import { PORTRAITS_IMAGE_PATH, PORTRAIT_SIZE } from '$lib/config';
  import { blankPortrait } from '$lib/data/portraits';
  import { t } from '$lib/locales/translations';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IList, IPortrait } from '$lib/types/api.types';
  import type {
    IUploadedPortrait,
    TDeleteHandler,
    TEditorData,
    TOpenEditCharacterDialog,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TOpenSelectCharacterDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/types/editor.types';
  import type { IPortraitFilters, ISorting } from '$lib/types/filters.types';
  import {
    parseFilters,
    parseParamsToFilters,
    parseParamsToSorting,
    parseSorting
  } from '$lib/utils/filters';
  import { debounce } from '$lib/utils/funtional';
  import { convertImageFile } from '$lib/utils/images';
  import { report } from '$lib/utils/log';
  import { createFormData, getPatchData, resizeImageFile } from '$lib/utils/portraits';
  import { request, sendFormData } from '$lib/utils/requests';
  import GalleryImage from '../GalleryImage.svelte';
  import Grid from '../Grid.svelte';
  import LoadMore from '../LoadMore.svelte';
  import type { PageData } from './$types';
  import FilterPortraitsDialog from './FilterPortraitsDialog.svelte';

  export let data: PageData;

  // incoming data: immutable maps
  const originals = new Map(data.originals.map(({ id, image, name }) => [id, { image, name }]));
  const tags = new Map(data.tags.map(({ id, image, name }) => [id, { image, name }]));
  const styles = new Map(data.styles.map(({ id, image, name }) => [id, { image, name }]));
  const colors = new Map(data.colors.map(({ image, name }) => [name, { image, name }]));
  const races = new Map(data.races.map((race) => [race.id, race]));
  const archetypes = new Map(data.archetypes.map(({ id, name }) => [id, { name }]));
  const backgrounds = new Map(data.backgrounds.map(({ id, name }) => [id, { name }]));

  // reactive data
  let selected: string[] = [];
  let uploaded: IUploadedPortrait[] = [];

  $: portraits = data.portraits;
  $: portraitsMap = new Map(data.portraits.map((p) => [p.id, p]));
  $: model = getModel(selected, uploaded);

  const getModel = (selected: string[], uploaded: IUploadedPortrait[]) => {
    if (!selected.length) return null;
    if (uploaded.length) return uploaded[0];
    return portraitsMap.get(selected[0]);
  };

  // filters data
  let isFilterDialogOpen = false;
  const defaultFilters = {
    original: [],
    quality: [],
    colors: [],
    tags: [],
    styles: [],
    hasCharacters: null
  };
  const defaultSorting: ISorting = { key: 'created', order: 'desc' };
  const href = browser ? window.location.href : undefined;
  let filters = parseParamsToFilters<IPortraitFilters>(href, defaultFilters);
  let sorting = parseParamsToSorting(href, defaultSorting);

  const enterUploadMode = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    try {
      uploaded = Array.from(input.files).map((file) => {
        if (!file.type.startsWith('image/'))
          throw new Error('Invalid file type, only images are allowed');

        const id = Math.random().toString(36).slice(2, 9);
        const src = URL.createObjectURL(file);
        return { ...blankPortrait, id, file, src };
      });

      selected = uploaded.map((file) => file.id);
    } catch (err) {
      toastError(err);
    } finally {
      input.value = '';
    }
  };

  const handleClick = (e: Event) => {
    if (uploaded.length) return;

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
    if (uploaded.length) return;

    const figure = (e.target as HTMLElement).closest('figure');
    const id = figure?.dataset.id;
    if (!id) return;

    if (selected.includes(id)) return;
    selected = [...selected, id];
  }, 5);

  const handleClearSelection = () => {
    selected = [];
    uploaded = [];
  };

  let genericDialogData: {
    isOpen: boolean;
    key: string;
    entries: [string, { image: string; name: string }][];
    selected: string[];
    onSubmit: (values: string[]) => void;
  };

  const openEditorDialog: TOpenEditorDialog = (key, entries, selected, onSubmit) => {
    genericDialogData = { isOpen: true, key, entries, selected, onSubmit };
  };

  let originalsDialogData = {
    isOpen: false,
    entries: [] as [string, { image: string; name: string }][],
    selected: '',
    onSubmit: (_: string) => {}
  };

  const openOriginalsDialog: TOpenOriginalsDialog = (selected, onSubmit) => {
    const entries = Array.from(originals.entries());
    originalsDialogData = { isOpen: true, entries, selected, onSubmit };
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

  const openEditCharacterDialog: TOpenEditCharacterDialog = (character, onSubmit, onDelete) => {
    const handleSubmit = (character: ICharacter) => {
      // mutate portraits page data if new character created
      data.portraits = data.portraits.map((portrait) => {
        if (
          character.portraits.includes(portrait.id) &&
          !portrait.characters?.includes(character.id)
        ) {
          portrait.characters = [...portrait.characters, character.id];
        }
        return portrait;
      });

      // mutate editor data
      onSubmit(character);
    };

    const handleDelete = (characterId: string) => {
      // mutate portraits page data
      data.portraits = data.portraits.map((portrait) => {
        if (portrait.characters?.includes(characterId)) {
          portrait.characters = portrait.characters.filter((id) => id !== characterId);
        }
        return portrait;
      });

      // mutate editor data
      onDelete(character.id);
    };

    const isEdit = Boolean(character.id);
    editCharacterDialogData = {
      ...editCharacterDialogData,
      portraitIds: isEdit ? character.portraits : selected,
      open: true,
      character,
      onSubmit: handleSubmit,
      onDelete: handleDelete
    };
  };

  let selectCharacterDialogData = {
    isOpen: false,
    currentIds: [] as string[],
    onSubmit: (_: ICharacter[]) => {},
    races
  };

  const openSelectCharacterDialog: TOpenSelectCharacterDialog = (
    currentIds: string[],
    onSubmit: (characters: ICharacter[]) => void
  ) => {
    selectCharacterDialogData = {
      ...selectCharacterDialogData,
      isOpen: true,
      currentIds: Array.from(currentIds),
      onSubmit
    };
  };

  const createPatchHandler = (): TPatchHandler => async (changes) => {
    const patches = [];
    for (const id of selected) {
      const portrait = portraitsMap.get(id);
      if (!portrait) continue;

      const patchData = getPatchData(changes, portrait);
      if (Object.keys(patchData).length) patches.push({ id, patchData });
    }

    try {
      const payload = { ids: selected, changes, patches };
      const results = await request<IPortrait[]>('/api/portraits', 'PATCH', payload);
      const resultsMap = new Map(results.map((portrait) => [portrait.id, portrait]));

      data.portraits = data.portraits.map((portrait) => {
        const updated = resultsMap.get(portrait.id);
        return updated || portrait;
      });

      selected = [];
    } catch (err) {
      report('admin', err, { request: 'patchPortraits', selected, changes, patches });
      toastError(err);
    }
  };

  const createPostHandler = (): TPostHandler => async (editorData: TEditorData) => {
    try {
      const promises = uploaded.map(async ({ file }) => {
        const resizedFile = await resizeImageFile(file, PORTRAIT_SIZE);
        const convertedFile = await convertImageFile(resizedFile);

        const formData = createFormData(editorData);
        formData.set('image', convertedFile);
        return sendFormData<IPortrait>('/api/portraits', formData, 'POST');
      });

      const results = await Promise.all(promises);
      data.portraits = [...results, ...data.portraits];

      uploaded.forEach((portrait) => URL.revokeObjectURL(portrait.src));
      uploaded = [];
      selected = [];
    } catch (err) {
      report('admin', err, { request: 'uploadPortraits', editorData });
      toastError(err);
    }
  };

  const createDeleteHandler = (): TDeleteHandler => async () => {
    try {
      await request('/api/portraits', 'DELETE', { ids: selected });
      data.portraits = data.portraits.filter((portrait) => !selected.includes(portrait.id));
      selected = [];
    } catch (err) {
      report('admin', err, { request: 'deletePortraits', ids: selected });
      toastError(err);
    }
  };

  const handleLoadMore = async () => {
    try {
      const params = new URLSearchParams({
        page: String(data.page + 1),
        pageSize: String(data.pageSize),
        sort: parseSorting(sorting)
      });
      params.append('filter', 'user=""');
      parseFilters(filters).forEach((value) => params.append('filter', value));
      const { items, page, totalPages } = await request<IList<IPortrait>>(
        `/api/portraits?${params}`
      );

      data.portraits = [...data.portraits, ...items];
      data.page = page;
      data.hasMore = page < totalPages;
    } catch (err) {
      report('admin', err, 'load more');
      toastError(err);
    }
  };

  const getSource = (item: IPortrait | IUploadedPortrait) => {
    if ('src' in item) return item.src;
    return `${PORTRAITS_IMAGE_PATH}/${item.id}/${item.image}`;
  };
</script>

<section
  class="gallery"
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleClick}
  on:mousedown={() => (isMouseDown = true)}
  on:mouseup={() => (isMouseDown = false)}
  on:mousemove={handleMousemove}
>
  <Grid>
    {#each [...uploaded, ...portraits] as item (item.id)}
      <GalleryImage
        id={item.id}
        src={getSource(item)}
        isSelected={selected.includes(item.id)}
        isDisabled={uploaded.length > 0}
      />
    {/each}
  </Grid>

  {#if portraits.length === 0}
    <div>No portraits found, try to change filter criteria</div>
  {/if}

  {#if data.hasMore}
    <LoadMore onClick={handleLoadMore} />
  {/if}
</section>

<SidePane>
  {#if model}
    <PortraitEditor
      {model}
      {originals}
      {tags}
      {styles}
      {colors}
      {openEditorDialog}
      {openOriginalsDialog}
      {openEditCharacterDialog}
      {openSelectCharacterDialog}
      {handleClearSelection}
      isUploading={Boolean(uploaded.length)}
      image={getSource(model)}
      selectedImages={selected.length}
      handlePatch={createPatchHandler()}
      handlePost={createPostHandler()}
      handleDelete={createDeleteHandler()}
    />
  {:else}
    <AdminMenu page="admin.menu.portraits" hint="admin.menu.hint.portraits">
      <BasicButton href="./">
        {$t('admin.menu.dashboard')}
      </BasicButton>

      <BasicButton href="./characters">
        {$t('admin.menu.characters')}
      </BasicButton>

      <BasicButton onClick={() => (isFilterDialogOpen = true)}>
        {$t('admin.menu.filter')}
      </BasicButton>

      <BasicButton onClick={() => document.getElementById('uploadFilesInput')?.click()}>
        {$t('admin.menu.upload')}
      </BasicButton>

      <BasicButton href="./portraits/duplicates">
        {$t('admin.menu.duplicates')}
      </BasicButton>

      <BasicButton href="./portraits/statistics">
        {$t('admin.menu.statistics')}
      </BasicButton>
    </AdminMenu>
  {/if}

  <input
    on:change={enterUploadMode}
    hidden
    id="uploadFilesInput"
    type="file"
    accept="image/webp, image/jpg, image/jpeg, image/png"
    multiple
  />
</SidePane>

{#if editCharacterDialogData.open}
  <AdminEditorDialog {...editCharacterDialogData} bind:isOpen={editCharacterDialogData.open} />
{/if}

{#if genericDialogData}
  <GenericDialog {...genericDialogData} />
{/if}

<OriginalsDialog {...originalsDialogData} />
<SelectCharacterDialog {...selectCharacterDialogData} />

<FilterPortraitsDialog bind:isOpen={isFilterDialogOpen} {filters} {sorting} {defaultSorting} />

<style lang="scss">
  @use 'sass:color';

  section.gallery {
    grid-area: content;
    width: 100%;
    overflow: auto;
  }
</style>
