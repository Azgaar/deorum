<script lang="ts">
  import structuredClone from '@ungap/structured-clone';
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';

  import { t } from '$lib/locales/translations';
  import { getEmojiedLabel } from '$lib/utils/label';
  import './_styles.scss';

  export let open: boolean;
  export let key: string;
  export let entries: [string, { emoji: string; name: string }][];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  $: current = structuredClone(selected);
  $: search = '';
  $: found = handleSearch(search, key);

  const handleSearch = (search: string, key: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test($t(`admin.${key}.${name}`)));
    return new Map(filtered);
  };

  const handleChange = (event: MouseEvent) => {
    event.stopPropagation();
    const element = event.target as HTMLElement;
    if (element.classList.contains('content')) return;
    element.querySelector('input')?.click();
  };

  const handleCancel = () => {
    open = false;
    search = '';
  };

  const handleApply = () => {
    onSubmit(current);
    open = false;
    search = '';
  };
</script>

<Dialog
  class="editorDialog"
  bind:open
  aria-labelledby="editor-dialog"
  aria-describedby="editor-dialog"
>
  <div class="title">
    <span>{$t('common.controls.select')} {$t(`admin.editor.${key}`).toLowerCase()}</span>
    <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
  </div>

  <div>
    <div class="content" on:click={handleChange}>
      {#each entries || [] as [entryId, { emoji, name }] (entryId)}
        <div class="entry" class:found={found.has(entryId)}>
          <Checkbox group={current} value={entryId} ripple={false} />
          <span>{@html getEmojiedLabel(key, { emoji, name })}</span>
        </div>
      {/each}
    </div>

    <Actions>
      <Button style="color: white" on:click={handleCancel}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
      <Button style="color: white" on:click={handleApply}>
        <Label>{$t('common.controls.apply')}</Label>
      </Button>
    </Actions>
  </div>
</Dialog>
