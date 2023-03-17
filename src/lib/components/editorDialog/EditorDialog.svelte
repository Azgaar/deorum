<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label as ButtonLabel } from '@smui/button';
  import Checkbox from '@smui/checkbox';

  import { makePOJO } from '$lib/utils/object';
  import { t } from '$lib/locales/translations';
  import Label from '$lib/components/label/Label.svelte';
  import './_styles.scss';

  export let open: boolean;
  export let key: string;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  $: current = makePOJO(selected);
  $: search = '';
  $: found = handleSearch(search, key);

  const handleSearch = (search: string, key: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test($t(`admin.${key}.${name}`)));
    return new Map(filtered);
  };

  const handleChange = (event: MouseEvent | KeyboardEvent) => {
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
    <div class="content" on:click={handleChange} on:keydown={handleChange}>
      {#each entries || [] as [entryId, { image, name }] (entryId)}
        <div class="entry" class:found={found.has(entryId)}>
          <Checkbox group={current} value={entryId} ripple={false} />
          <div class="labelWrapper">
            <Label label={{ image, name }} type={key} />
          </div>
        </div>
      {/each}
    </div>

    <Actions>
      <Button style="color: white" on:click={handleCancel}>
        <ButtonLabel>{$t('common.controls.cancel')}</ButtonLabel>
      </Button>

      <Button style="color: white" on:click={handleApply}>
        <ButtonLabel>{$t('common.controls.apply')}</ButtonLabel>
      </Button>
    </Actions>
  </div>
</Dialog>

<style lang="scss">
  div.labelWrapper {
    max-width: 75%;
    pointer-events: none;
  }
</style>
