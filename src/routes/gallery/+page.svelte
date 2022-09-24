<script lang="ts">
  import PocketBase from 'pocketbase';
  import IconButton from '@smui/icon-button';
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
  $: lastSelected = selected.length ? portraitsMap.get(selected.at(-1)!)! : firstPortrait;

  const collectionId = firstPortrait['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;

  const handleClick = (id: string) => () => {
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
    onSubmit: (selected: string[]) => {}
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
        <Checkbox checked={selected.includes(item.id)} touch ripple={false} />
      </div>
    </div>
  {/each}
</section>

<aside class="pane" class:open={lastSelected}>
  <div class="imageContainer">
    <img loading="lazy" alt="main" src={`${imagesPath}/${lastSelected.id}/${lastSelected.image}`} />

    <div class="imageOverlay" class:hidden={selected.length < 2}>
      <span>{selected.length}</span>
    </div>

    <IconButton on:click={handleClearSelection} class="material-icons closeButton" title="Remove"
      >close</IconButton
    >
  </div>

  <Editor
    model={lastSelected}
    {originals}
    {tags}
    {styles}
    {openEditorDialog}
    patchSelected={patchSelected(selected)}
  />
</aside>

<EditorDialog {...editorDialogData} />
