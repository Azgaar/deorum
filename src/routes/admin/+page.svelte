<script lang="ts">
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import OriginalsDialog from '$lib/components/editor/originalsDialog/OriginalsDialog.svelte';
  import EditCharacterDialog from '$lib/components/editor/characterDialog/EditCharacterDialog.svelte';
  import SelectCharacterDialog from '$lib/components/editor/characterDialog/SelectCharacterDialog.svelte';
  import Menu from '$lib/components/menu/Menu.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';
  import Filters from '$lib/components/filters/Filters.svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { getPortraits, patchPortraits, postPortraits } from '$lib/api';
  import { deletePortraits } from '$lib/api/deletePortraits';
  import { toastError } from '$lib/stores';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';

  import type { ICharacter, IPortrait } from '$lib/types/api.types';
  import type {
    TEditorData,
    IUploadedPortrait,
    TDeleteHandler,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler,
    TOpenEditCharacterDialog,
    TOpenSelectCharacterDialog
  } from '$lib/types/editor.types';
  import type { IFilters, ISorting } from '$lib/types/filters.types';

  export let data: import('./$types').PageData;

  // incoming data: immutable
  const { originals, tags, styles, colors, races, archetypes, backgrounds } = data;

  // incoming data: mutable
  let { page, hasMore, filters, sorting } = data;

  // reactive data
  let selected: string[] = [];
  let uploaded: IUploadedPortrait[] = [];

  $: portraits = data.portraits || [];
  $: portraitsMap = new Map(portraits.map((p) => [p.id, p]));
  $: model = getModel(selected, uploaded);

  const getModel = (selected: string[], uploaded: IUploadedPortrait[]) => {
    if (!selected.length) return null;
    if (uploaded.length) return uploaded[0];
    return portraitsMap.get(selected[0]);
  };

  const enterUploadMode = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    uploaded = Array.from(input.files).map((file) => {
      const id = Math.random().toString(36).slice(2, 9);
      const src = URL.createObjectURL(file);

      return {
        id,
        file,
        src,
        original: '',
        tags: [],
        styles: [],
        colors: [],
        quality: 0,
        name: '',
        age: 0,
        gender: '',
        race: '',
        archetype: '',
        background: '',
        image: '',
        characters: []
      };
    }) as unknown as IUploadedPortrait[];

    selected = uploaded.map((file) => file.id);
    input.value = '';
  };

  const handleClick = (id: string) => () => {
    if (uploaded.length) return;

    if (selected.includes(id)) {
      selected = selected.filter((item) => item !== id);
      return;
    }

    if (selected.length > 1) {
      selected = [...selected, id];
    } else {
      selected = [id];
    }
  };

  const handleCheck = (id: string) => (event: CustomEvent<HTMLElement>) => {
    event.stopPropagation();
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  };

  const handleClearSelection = () => {
    selected = [];
    uploaded = [];
  };

  let editorDialogData = {
    open: false,
    key: '',
    entries: [] as [string, { image: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const openEditorDialog: TOpenEditorDialog = (key, entries, selected, onSubmit) => {
    editorDialogData = { open: true, key, entries, selected, onSubmit };
  };

  let originalsDialogData = {
    open: false,
    entries: [] as [string, { image: string; name: string }][],
    selected: '',
    onSubmit: (_: string) => {}
  };

  const openOriginalsDialog: TOpenOriginalsDialog = (selected, onSubmit) => {
    const entries = Array.from(originals.entries());
    originalsDialogData = { open: true, entries, selected, onSubmit };
  };

  let characterDialogData = {
    open: false,
    character: {} as ICharacter,
    onSubmit: (_: ICharacter) => {},
    onDelete: (_: string) => {},
    portraitIds: [] as string[],
    races,
    archetypes,
    backgrounds
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
    characterDialogData = {
      ...characterDialogData,
      portraitIds: isEdit ? character.portraits : selected,
      open: true,
      character,
      onSubmit: handleSubmit,
      onDelete: handleDelete
    };
  };

  let selectCharacterDialogData = {
    open: false,
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
      open: true,
      currentIds: Array.from(currentIds),
      onSubmit
    };
  };

  let filtersData = {
    open: false,
    filters,
    sorting,
    onSubmit: (_: IFilters, __: ISorting) => {},
    originalsMap: originals,
    tagsMap: tags,
    stylesMap: styles
  };

  const openFilters = () => {
    const onSubmit = async (newFilter: IFilters, newSort: ISorting) => {
      try {
        filtersData = { ...filtersData, open: false };

        const filter = parseFilters(newFilter);
        const sort = parseSorting(newSort);
        const { items, totalPages } = await getPortraits({ page: 1, filter, sort });

        const queryString = `/admin?filter=${filter}&sort=${sort}`;
        window.history.pushState({}, '', queryString);

        sorting = newSort;
        filters = newFilter;
        page = 1;
        hasMore = page < totalPages;
        data.portraits = items;
      } catch (err) {
        report('admin', err, { request: 'getPortraits', filter: newFilter, sort: newSort });
        toastError(err);
      }
    };

    filtersData = { ...filtersData, open: true, filters, sorting, onSubmit };
  };

  const createPatchHandler = (): TPatchHandler => async (changes) => {
    const results = await patchPortraits(selected, portraitsMap, changes);
    const resultsMap = new Map(results.map((portrait) => [portrait.id, portrait]));

    data.portraits = data.portraits.map((portrait) => {
      const updated = resultsMap.get(portrait.id);
      return updated || portrait;
    });

    selected = [];
  };

  const createPostHandler = (): TPostHandler => async (editorData: TEditorData) => {
    const results = await postPortraits(uploaded, editorData);
    data.portraits = [...results, ...data.portraits];

    selected = [];
    uploaded.forEach((portrait) => URL.revokeObjectURL(portrait.src));
    uploaded = [];
  };

  const createDeleteHandler = (): TDeleteHandler => async () => {
    await deletePortraits(selected);
    data.portraits = data.portraits.filter((portrait) => !selected.includes(portrait.id));
    selected = [];
  };

  const handleLoadMore = async () => {
    try {
      const filter = parseFilters(filters);
      const sort = parseSorting(sorting);
      const { items, totalPages } = await getPortraits({ page: page + 1, filter, sort });

      page += 1;
      hasMore = page < totalPages;
      data.portraits = [...data.portraits, ...items];
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

<main>
  <section class="gallery">
    <div class="grid">
      {#each [...uploaded, ...portraits] as item (item.id)}
        <div class="imageContainer" on:click={handleClick(item.id)}>
          <img
            loading="lazy"
            alt={item.id}
            src={getSource(item)}
            class:selected={selected.includes(item.id)}
          />

          {#if !uploaded.length || selected.includes(item.id)}
            <div class="checkbox" class:hidden={!selected.length && !selected.includes(item.id)}>
              <Checkbox
                on:click={handleCheck(item.id)}
                checked={selected.includes(item.id)}
                disabled={uploaded.length > 0}
                touch
                ripple={false}
                class="checkboxInput"
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>

    {#if portraits.length === 0}
      <div>No portraits found, try to change filter criteria</div>
    {/if}

    {#if hasMore}
      <LoadMore onClick={handleLoadMore} />
    {/if}
  </section>

  <aside class="pane">
    {#if model}
      <Editor
        {model}
        {originals}
        {tags}
        {styles}
        {colors}
        {races}
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
      <Menu {openFilters} />
    {/if}
  </aside>
</main>

<EditorDialog {...editorDialogData} />
<OriginalsDialog {...originalsDialogData} />
<EditCharacterDialog {...characterDialogData} />
<SelectCharacterDialog {...selectCharacterDialogData} />

<Filters {...filtersData} />

<input
  on:change={enterUploadMode}
  style="display: none;"
  id="filesInput"
  type="file"
  accept="image/jpg, image/jpeg, image/png"
  multiple
/>

<style lang="scss">
  @use 'sass:color';

  $pane-width-min: 360px;
  $pane-width-max: 460px;

  main {
    height: 100vh;
    overflow: hidden;
    user-select: none;

    display: grid;
    grid-template-columns: 3fr minmax($pane-width-min, 1fr);
    grid-template-areas: 'gallery pane';

    section.gallery {
      grid-area: gallery;
      width: 100%;
      overflow: auto;

      div.grid {
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

        @media (max-width: 1199px) {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        @media (max-width: 899px) {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        @media (max-width: 599px) {
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        }

        .imageContainer {
          position: relative;
          aspect-ratio: 1;

          img {
            position: absolute;
            width: 100%;
            height: 100%;
            transition: filter 0.2s ease-in-out;
          }

          img.selected {
            filter: brightness(0.8);
          }

          div.checkbox {
            position: absolute;
            bottom: 0;
            left: 0;
            transition: all 0.3s ease-in-out;
          }

          div.checkbox.hidden {
            opacity: 0;
          }
        }

        .imageContainer:hover {
          div.checkbox {
            opacity: 1;
          }
        }
      }
    }

    :global(.imageContainer:hover div.mdc-checkbox__background) {
      transition: all 0.3s ease-in-out;
      border-color: color.adjust($text, $alpha: -0.1) !important;
    }

    aside.pane {
      grid-area: pane;
      background-image: url('/images/menu.webp');
      background-size: 100% 100%;
      overflow: hidden;

      display: flex;
      justify-content: center;

      @media (max-width: 599px) {
        display: flex;
        justify-content: center;
        padding: 1rem 2rem;
        width: auto;
      }
    }
  }
</style>
