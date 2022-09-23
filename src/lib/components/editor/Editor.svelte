<script lang="ts">
  import type { IPortrait } from '$lib/api.types';
  import { colorsMap } from '$lib/config';
  import {
    changeableKeys,
    type IChange,
    type TOpenEditorDialog,
    type TPatchSelected
  } from '$lib/editor.types';
  import './_styles.scss';

  export let model: IPortrait;
  $: current = structuredClone(model);

  export let originals: Map<string, string>;
  export let tags: Map<string, string>;
  export let styles: Map<string, string>;

  export let openEditorDialog: TOpenEditorDialog;
  export let patchSelected: TPatchSelected;

  let isChanged = false;

  const handleRemove = (key: 'styles' | 'colors' | 'tags', id: string) => () => {
    current[key] = current[key].filter((item) => item !== id);
    isChanged = true;
  };

  const handleEdit = (key: 'styles' | 'colors' | 'tags', map: Map<string, string>) => () => {
    const title = 'Select ' + key;
    const entries = Array.from(map.entries());
    const selected = current[key] as string[];

    const onSubmit = (newSelected: string[]) => {
      if (current[key].join('') !== newSelected.join('')) {
        current[key] = newSelected;
        isChanged = true;
      }
    };

    openEditorDialog(title, entries, selected, onSubmit);
  };

  const handleCancel = () => {
    current = structuredClone(model);
    isChanged = false;
  };

  const handleSave = async () => {
    try {
      const changes: IChange[] = [];

      for (const key of changeableKeys) {
        const oldValue = model[key];
        const value = current[key];

        if (Array.isArray(value)) {
          if (!Array.isArray(oldValue)) throw 'Invalid type';

          if (value.length > oldValue.length) {
            for (const item of value) {
              if (!oldValue.includes(item)) {
                changes.push({ key, operation: 'add', value: item });
              }
            }
          }

          if (value.length < oldValue.length) {
            for (const item of oldValue) {
              if (!value.includes(item)) {
                changes.push({ key, operation: 'remove', value: item });
              }
            }
          }

          continue;
        }

        if (value !== oldValue) changes.push({ key, operation: 'update', value });
      }

      await patchSelected(changes);
      isChanged = false;
    } catch (error) {
      console.error(error);
    }
  };
</script>

<section class="editor">
  <div>
    Original: {originals.get(current.original)}
  </div>

  <div>
    Quality: {current.quality}
  </div>

  <div>
    Colors:
    {#each current.colors as color (color)}
      <span class="chip">
        {@html colorsMap.get(color)}
        <span on:click={handleRemove('colors', color)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('colors', colorsMap)}>✏️</span>
  </div>

  <div>
    Tags:
    {#each current.tags as tagId (tagId)}
      <span class="chip">
        {tags.get(tagId)}
        <span on:click={handleRemove('tags', tagId)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('tags', tags)}>✏️</span>
  </div>

  <div>
    Styles:
    {#each current.styles as styleId (styleId)}
      <span class="chip">
        {styles.get(styleId)}
        <span class="action" on:click={handleRemove('styles', styleId)}>✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('styles', styles)}>✏️</span>
  </div>
</section>

<footer class="editorFooter">
  <button disabled={!isChanged} on:click={handleCancel} class="button">Cancel</button>
  <button disabled={!isChanged} on:click={handleSave} class="button">Save</button>
</footer>
