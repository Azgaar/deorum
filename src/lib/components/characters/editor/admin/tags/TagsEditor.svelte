<script lang="ts">
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import Chip from '$lib/components/editor/chips/Chip.svelte';
  import { t } from '$lib/locales/translations';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';
  import { isSameArray } from '$lib/utils/array';

  export let tags: string[] = [];
  export let tagsMap: Map<string, { name: string; image: string }>;
  export let openEditorDialog: TOpenEditorDialog;

  const handleTagRemove = (tagToRemove: string) => () => {
    tags = tags.filter((tag) => tag !== tagToRemove);
  };

  const handleListEdit = () => {
    const entries = Array.from(tagsMap.entries());

    const onSubmit = (newSelected: string[]) => {
      if (isSameArray(tags, newSelected)) return;
      tags = newSelected;
    };

    openEditorDialog('tags', entries, tags, onSubmit);
  };
</script>

<div class="tags">
  <div>{$t('admin.editor.tags')}:</div>
  <div class="chipsContainer">
    {#each tags as tagId (tagId)}
      <Chip chip={tagsMap.get(tagId)} type="tags" handleRemove={handleTagRemove(tagId)} />
    {/each}
  </div>
  <IconButton onClick={handleListEdit}>⚙️</IconButton>
</div>

<style lang="scss">
  div.tags {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 4px;

    div.chipsContainer {
      display: grid;
      grid-auto-flow: column;
      gap: 2px 4px;
      justify-self: start;
    }
  }
</style>
