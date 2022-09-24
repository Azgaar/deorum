<script lang="ts">
  import { fade } from 'svelte/transition';
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import { URL } from '$lib/config';

  import type { IPortrait } from '$lib/api.types';
  import { patchPortraits } from '$lib/api/patchPortraits';
  import type { TOpenEditorDialog, TPatchSelected } from '$lib/editor.types';
  import './_styles.scss';

  export let data: {
    portraits: IPortrait[];
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, string>;
  };

  // immutable
  const { originals, tags, styles } = data;
  const firstPortrait = data.portraits[0];

  // dynamic data
  $: portraits = data.portraits || [];
  $: portraitsMap = new Map(portraits.map((p) => [p.id, p]));

  let selected: string[] = [];
  $: firstSelected = selected.length ? portraitsMap.get(selected[0]) : null;

  const collectionId = firstPortrait['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;

  const handleClick = (id: string) => () => {
    console.log('image click');
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
    console.log('check');
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

  const patchSelected =
    (selected: string[]): TPatchSelected =>
    async (changes) => {
      const results = await patchPortraits(selected, portraitsMap, changes);
      const resultsMap = new Map(results.map((portrait) => [portrait.id, portrait]));

      console.log('selected', selected);
      console.log('resultsMap', resultsMap);

      data.portraits = data.portraits.map((portrait) => {
        const updated = resultsMap.get(portrait.id);
        return updated || portrait;
      });

      console.log('portraitsMap', portraitsMap);
      console.log('data', data.portraits);
    };
</script>

<section class="gallery">
  {#each portraits as item (item.id)}
    <div class="imageContainer" on:click={handleClick(item.id)}>
      <img
        loading="lazy"
        alt={originals.get(item.original)}
        src={`${imagesPath}/${item.id}/${item.image}`}
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
        patchSelected={patchSelected(selected)}
      />
    </div>
  {/if}
</aside>

<EditorDialog {...editorDialogData} />
