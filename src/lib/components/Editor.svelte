<script lang="ts">
  import type { IPortrait } from '$lib/api.types';
  import { colors } from '$lib/config';

  export let selected: string[];
  export let model: IPortrait;

  console.log(selected, model);

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
        <span class="color" style="color:{color}">⬤</span>
        {color}
        <span on:click={handleRemoveColor(color)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action">✏️</span>
  </div>

  <div>
    Tags:
    {#each currentTags as [tagId, tagName] (tagId)}
      <span class="chip">
        {tagName}
        <span on:click={handleRemoveTag(tagId)} class="action">✕</span>
      </span>
    {/each}
    <span class="chip action">✏️</span>
  </div>

  <div>
    Styles:
    {#each currentStyles as [styleId, styleName] (styleId)}
      <span class="chip">
        {styleName}
        <span class="action" on:click={handleRemoveStyle(styleId)}>✕</span>
      </span>
    {/each}
    <span class="chip action">✏️</span>
  </div>
</section>

<footer>
  <button disabled={!isChanged} class="button">Save</button>
  <button disabled={!isChanged} on:click={handleCancel} class="button">Cancel</button>
</footer>

<style>
  section.editor {
    padding: 0.5em;
    font-size: 22px;
  }

  div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1em;
  }

  span.chip {
    padding: 0.2em 0.6em;
    margin: 0.2em;
    background: #666;
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
  }

  span.chip:hover {
    background: #777;
  }

  span.chip:active {
    background: #888;
  }

  span.action {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  span.chip > span.action {
    opacity: 0;
  }

  span.chip:hover > span.action {
    padding: 0 0.2em;
    background-color: #555;
    border-radius: 50%;
    opacity: 1;
  }

  span.color {
    font-size: smaller;
    vertical-align: text-bottom;
  }

  footer {
    display: flex;
    justify-self: end;
    flex-grow: 1;
    align-items: flex-end;
    justify-content: space-between;
  }

  footer > button {
    border: none;
    font-size: 32px;
    padding: 0.5em;
    width: 50%;
  }

  footer > button:hover {
    background: #999;
  }
</style>
