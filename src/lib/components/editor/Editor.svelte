<script lang="ts">
  import type { IPortrait } from '$lib/api.types';
  import { colorsMap } from '$lib/config';
  import './_styles.scss';

  // export let selected: string[];
  export let model: IPortrait;

  export let openEditorDialog: (
    title: string,
    entries: [string, string][],
    selected: string[]
  ) => void;

  export let originals: Map<string, string>;
  export let tags: Map<string, string>;
  export let styles: Map<string, string>;

  $: original = originals.get(model.original)!;
  $: currentColors = model.colors;
  $: currentTags = model.tags.map((tag) => [tag, tags.get(tag)!]);
  $: currentStyles = model.styles.map((style) => [style, styles.get(style)!]);

  let isChanged = false;

  const handleRemoveColor = (color: string) => () => {
    currentColors = currentColors.filter((item) => item !== color);
    isChanged = true;
  };

  const handleRemoveTag = (tagId: string) => () => {
    currentTags = currentTags.filter(([id]) => id !== tagId);
    isChanged = true;
  };

  const handleRemoveStyle = (styleId: string) => () => {
    currentStyles = currentStyles.filter(([id]) => id !== styleId);
    isChanged = true;
  };

  const handleEdit = (title: string, map: Map<string, string>, selected: string[]) => () => {
    const entries = Array.from(map.entries());
    openEditorDialog(title, entries, selected);
  };

  const handleCancel = () => {
    currentColors = model.colors;
    currentTags = model.tags.map((tag) => [tag, tags.get(tag)!]);
    currentStyles = model.styles.map((style) => [style, styles.get(style)!]);
    isChanged = false;
  };
</script>

<section class="editor">
  <div>
    Original: {original}
  </div>

  <div>
    Quality: {model.quality}
  </div>

  <div>
    Colors:
    {#each currentColors as color (color)}
      <span class="chip">
        {@html colorsMap.get(color)}
        <span on:click={handleRemoveColor(color)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('Select colors', colorsMap, model.colors)}
      >✏️</span
    >
  </div>

  <div>
    Tags:
    {#each currentTags as [tagId, tagName] (tagId)}
      <span class="chip">
        {tagName}
        <span on:click={handleRemoveTag(tagId)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('Select tags', tags, model.tags)}>✏️</span>
  </div>

  <div>
    Styles:
    {#each currentStyles as [styleId, styleName] (styleId)}
      <span class="chip">
        {styleName}
        <span class="action" on:click={handleRemoveStyle(styleId)}>✕</span>
      </span>
    {/each}
    <span class="chip action" on:click={handleEdit('Select styles', styles, model.styles)}>✏️</span>
  </div>
</section>

<footer class="editorFooter">
  <button disabled={!isChanged} class="button">Save</button>
  <button disabled={!isChanged} on:click={handleCancel} class="button">Cancel</button>
</footer>
