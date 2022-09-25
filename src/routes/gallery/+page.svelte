<script lang="ts">
  import { fade } from 'svelte/transition';
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import OriginalsDialog from '$lib/components/originalsDialog/OriginalsDialog.svelte';
  import Menu from '$lib/components/menu/Menu.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';

  import type { IPortrait } from '$lib/api.types';
  import { patchPortraits } from '$lib/api/patchPortraits';
  import type { TOpenEditorDialog, TOpenOriginalsDialog, TPatchSelected } from '$lib/editor.types';
  import { fetchPortraits } from '$lib/api/fetchPortraits';
  import { normalizeError } from '$lib/utils/errors';
  import { toastError } from '$lib/stores';
  import './_styles.scss';

  export let data: {
    page: number;
    hasMore: boolean;
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
  let { page, hasMore } = data;

  // dynamic data
  $: portraits = data.portraits || [];
  $: portraitsMap = new Map(portraits.map((p) => [p.id, p]));

  let selected: string[] = [];
  $: firstSelected = selected.length ? portraitsMap.get(selected[0]) : null;

  const handleClick = (id: string) => () => {
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

  const patchSelected =
    (selected: string[]): TPatchSelected =>
    async (changes) => {
      const results = await patchPortraits(selected, portraitsMap, changes);
      const resultsMap = new Map(results.map((portrait) => [portrait.id, portrait]));

      data.portraits = data.portraits.map((portrait) => {
        const updated = resultsMap.get(portrait.id);
        return updated || portrait;
      });
    };

  const handleLoadMore = async () => {
    try {
      const { items, totalPages } = await fetchPortraits(page + 1);

      page += 1;
      data.portraits = [...data.portraits, ...items];
      hasMore = page < totalPages;
    } catch (err) {
      console.error(err);
      toastError(normalizeError(err));
    }
  };
</script>

<section class="gallery">
  {#each portraits as item (item.id)}
    <div class="imageContainer" on:click={handleClick(item.id)}>
      <img
        loading="lazy"
        alt={originals.get(item.original)?.name}
        src={`${portraitsImagePath}/${item.id}/${item.image}`}
        class:selected={selected.includes(item.id)}
      />
      <div class="checkbox" class:hidden={!selected.length && !selected.includes(item.id)}>
        <Checkbox
          on:click={handleCheck(item.id)}
          checked={selected.includes(item.id)}
          touch
          ripple={false}
        />
      </div>
    </div>
  {/each}

  {#if hasMore}
    <LoadMore onClick={handleLoadMore} />
  {/if}
</section>

<aside class="pane">
  {#if firstSelected}
    <div class="content" transition:fade={{ duration: 300 }}>
      <section class="controls">
        Selected: {selected.length}
        <div class="actionButton" on:click={handleClearSelection}>✕</div>
      </section>

      <Editor
        model={firstSelected}
        {originals}
        {tags}
        {styles}
        {openEditorDialog}
        {openOriginalsDialog}
        patchSelected={patchSelected(selected)}
      />
    </div>
  {:else}
    <Menu />
  {/if}
</aside>

<EditorDialog {...editorDialogData} />
<OriginalsDialog path={originalsImagePath} {...originalsDialogData} />
