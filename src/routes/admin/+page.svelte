<script lang="ts">
  import { fade } from 'svelte/transition';
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import OriginalsDialog from '$lib/components/originalsDialog/OriginalsDialog.svelte';
  import Menu from '$lib/components/menu/Menu.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';
  import Filters from '$lib/components/filters/Filters.svelte';

  import { getPortraits, patchPortraits, postPortraits } from '$lib/api';
  import { normalizeError } from '$lib/utils/errors';
  import { toastError } from '$lib/stores';

  import type { IPortrait } from '$lib/api.types';
  import type {
    IEditorData,
    IUploadedPortrait,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/editor.types';
  import './_styles.scss';

  export let data: {
    page: number;
    hasMore: boolean;
    filter: string;
    sort: string;
    portraits: IPortrait[];
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, { image: string; name: string }>;
    portraitsImagePath: string;
    originalsImagePath: string;
  };

  // immutable
  const { originals, tags, styles, portraitsImagePath, originalsImagePath } = data;

  // mutable
  let { page, hasMore, filter, sort } = data;

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
    title: '',
    entries: [] as [string, string][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const openEditorDialog: TOpenEditorDialog = (title, entries, selected, onSubmit) => {
    editorDialogData = { open: true, title, entries, selected, onSubmit };
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

  let filtersData = { open: false, filter, sort, onSubmit: (_: string, __: string) => {} };

  const openFilters = () => {
    const onSubmit = async (newFilter: string, newSort: string) => {
      try {
        filtersData = { ...filtersData, open: false };
        const { items, totalPages } = await getPortraits({
          page: 1,
          filter: newFilter,
          sort: newSort
        });

        sort = newSort;
        filter = newFilter;
        page = 1;
        hasMore = page < totalPages;
        data.portraits = items;
      } catch (err) {
        console.error(err);
        toastError(normalizeError(err));
      }
    };

    filtersData = { open: true, filter, sort, onSubmit };
  };

  const createPatchHandler =
    (selected: string[]): TPatchHandler =>
    async (changes) => {
      const results = await patchPortraits(selected, portraitsMap, changes);
      const resultsMap = new Map(results.map((portrait) => [portrait.id, portrait]));

      data.portraits = data.portraits.map((portrait) => {
        const updated = resultsMap.get(portrait.id);
        return updated || portrait;
      });
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
          />
        </div>
      {/if}
    </div>
  {/each}

  {#if portraits.length === 0}
    <div>No portraits found, try to change filter criteria</div>
  {/if}

  {#if hasMore}
    <LoadMore onClick={handleLoadMore} />
  {/if}
</section>

<aside class="pane">
  {#if model}
    <div class="content" transition:fade={{ duration: 300 }}>
      <div>
        {uploaded.length ? 'Uploaded' : 'Selected'}: {selected.length}
      </div>

      <Editor
        {model}
        {originals}
        {tags}
        {styles}
        {openEditorDialog}
        {openOriginalsDialog}
        {handleClearSelection}
        isUploading={Boolean(uploaded.length)}
        handlePatch={createPatchHandler(selected)}
        handlePost={createPostHandler()}
      />
    </div>
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
