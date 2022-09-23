<script lang="ts">
  import PocketBase from 'pocketbase';
  import IconButton from '@smui/icon-button';
  import Checkbox from '@smui/checkbox';

  import Editor from '$lib/components/editor/Editor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import { URL } from '$lib/config';

  import type { IPortrait } from '$lib/api.types';
  import { changeableKeys, type TOpenEditorDialog, type TPatchSelected } from '$lib/editor.types';
  import './_styles.scss';

  export let data: {
    portraits: IPortrait[];
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, string>;
  };

  const client = new PocketBase(URL);

  const { portraits, originals, tags, styles } = data;
  const portraitsMap = new Map(portraits.map((p) => [p.id, p]));

  let selected: string[] = [];
  $: firstSelected = selected.length ? portraitsMap.get(selected.at(0)!)! : portraits[0]!;
  $: lastSelected = selected.length ? portraitsMap.get(selected.at(-1)!)! : portraits[0]!;

  const collectionId = portraits[0]?.['@collectionId'];
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
      const getNewValue = (
        operation: 'update' | 'add' | 'remove',
        oldValue: unknown,
        value: string | number
      ) => {
        if (operation === 'update' || !Array.isArray(oldValue)) return value;
        if (operation === 'add') return [...oldValue, value];
        if (operation === 'remove') return oldValue.filter((item) => item !== value);
      };

      const getPatchData = (id: string) => {
        const portrait = portraitsMap.get(id)!;
        const tempItem = structuredClone(portrait);

        for (const { key, operation, value } of changes) {
          (tempItem[key] as unknown) = getNewValue(operation, tempItem[key], value);
        }

        const patchData: Partial<IPortrait> = {};
        for (const key of changeableKeys) {
          const oldValue = portrait[key];
          const newValue = tempItem[key];
          if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;
          (patchData[key] as unknown) = newValue;
        }

        return patchData;
      };

      const patches = [];
      for (const id of selected) {
        const patchData = getPatchData(id);
        if (Object.keys(patchData).length) patches.push({ id, patchData });
      }

      const promises = patches.map(({ id, patchData }) => {
        const promise = client.records.update('portraits', id, patchData);
        promise.then((updated) => {
          portraitsMap.set(id, updated as unknown as IPortrait);
        });
        return promise;
      });

      await Promise.allSettled(promises);
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
