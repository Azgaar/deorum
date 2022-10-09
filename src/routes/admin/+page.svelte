<script lang="ts">
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import OriginalsDialog from '$lib/components/originalsDialog/OriginalsDialog.svelte';
  import Menu from '$lib/components/menu/Menu.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';
  import Filters from '$lib/components/filters/Filters.svelte';

  import { getPortraits, patchPortraits, postPortraits } from '$lib/api';
  import { normalizeError } from '$lib/utils/errors';
  import { toastError, role } from '$lib/stores';

  import type { IPortrait } from '$lib/api.types';
  import type {
    IEditorData,
    IUploadedPortrait,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/editor.types';
  import type { IFilters, ISorting } from '$lib/filters.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { permitted } from '$lib/config';

  export let data: {
    page: number;
    hasMore: boolean;
    filters: IFilters;
    sorting: ISorting;
    portraits: IPortrait[];
    tags: Map<string, { emoji: string; name: string }>;
    styles: Map<string, { emoji: string; name: string }>;
    originals: Map<string, { image: string; name: string }>;
    portraitsImagePath: string;
    originalsImagePath: string;
  };

  // immutable
  const { originals, tags, styles, portraitsImagePath, originalsImagePath } = data;

  // mutable
  let { page, hasMore, filters, sorting } = data;

  // dynamic data
  $: portraits = data.portraits || [];
  $: portraitsMap = new Map(portraits.map((p) => [p.id, p]));

  let selected: string[] = [];
  let uploaded: IUploadedPortrait[] = [];
  $: model = getModel(selected, uploaded);

  const getModel = (selected: string[], uploaded: IUploadedPortrait[]) => {
    if (!selected.length) return null;
    if (uploaded.length) return uploaded[0];
    return portraitsMap.get(selected[0]);
  };

  $: can = permitted($role);
  $: canEdit = can('edit');

  const enterUploadMode = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    uploaded = Array.from(input.files).map((file) => {
      const id = Math.random().toString(36).slice(2, 9);
      const src = URL.createObjectURL(file);
      return { id, file, src, original: '', tags: [], styles: [], colors: [], quality: 0 };
    });

    selected = uploaded.map((file) => file.id);
    input.value = '';
  };

  const handleClick = (id: string) => () => {
    if (!canEdit || uploaded.length) return;

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
    entries: [] as [string, { emoji: string; name: string }][],
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

  let filtersData = {
    open: false,
    filters,
    sorting,
    onSubmit: (_: IFilters, __: ISorting) => {},
    originalsImagePath,
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
        console.error(err);
        toastError(normalizeError(err));
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

  const createPostHandler = (): TPostHandler => async (editorData: IEditorData) => {
    const results = await postPortraits(uploaded, editorData);
    data.portraits = [...results, ...data.portraits];

    selected = [];
    uploaded.forEach((portrait) => URL.revokeObjectURL(portrait.src));
    uploaded = [];
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
      console.error(err);
      toastError(normalizeError(err));
    }
  };

  const getSource = (item: IPortrait | IUploadedPortrait) => {
    if ('src' in item) return item.src;
    return `${portraitsImagePath}/${item.id}/${item.image}`;
  };
</script>

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

        {#if canEdit && (!uploaded.length || selected.includes(item.id))}
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
      {openEditorDialog}
      {openOriginalsDialog}
      {handleClearSelection}
      isUploading={Boolean(uploaded.length)}
      image={getSource(model)}
      selectedImages={selected.length}
      handlePatch={createPatchHandler()}
      handlePost={createPostHandler()}
    />
  {:else}
    <Menu {openFilters} />
  {/if}
</aside>

<EditorDialog {...editorDialogData} />
<OriginalsDialog path={originalsImagePath} {...originalsDialogData} />
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

  $pane-width: 320px;

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
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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
    background-image: url('/images/menu.png');
    background-size: 100% 100%;
    max-height: 100%;
    overflow: auto;

    padding: 2.5rem 2rem;
    width: clamp(300px, $pane-width, 33vw);

    @media (max-width: 599px) {
      display: flex;
      justify-content: center;
      padding: 1rem 2rem;
      width: auto;
    }
  }
</style>
