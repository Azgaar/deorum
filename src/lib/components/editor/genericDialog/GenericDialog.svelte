<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import Label from '$lib/components/label/Label.svelte';
  import { t } from '$lib/locales/translations';

  export let isOpen: boolean;
  export let key: string;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  const handleSearch = (search: string, key: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test($t(`admin.${key}.${name}`)));
    return new Map(filtered);
  };

  let search = '';
  $: found = handleSearch(search, key);

  const handleCancel = () => {
    isOpen = false;
    search = '';
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const current = Array.from(formData.keys());

    onSubmit(current);
    handleCancel();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    <div class="title">
      <span>{$t('common.controls.select')} {$t(`admin.editor.${key}`).toLowerCase()}</span>
      <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
    </div>
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        {#each entries || [] as [entryId, { image, name }] (entryId)}
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="entry" class:found={found.has(entryId)}>
            <Checkbox name={entryId} checked={selected.includes(entryId)} />
            <div class="labelWrapper">
              <Label label={{ image, name }} type={key} />
            </div>
          </label>
        {/each}
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    input[type='search'] {
      outline: none;
      height: 26px;
      border: none;
      border-bottom: 1px solid black;
      background: #26262b;
      color: white;
      border-radius: 2px;
      text-indent: 4px;
    }
  }

  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    max-height: 80vh;
    overflow-y: auto;

    .entry {
      padding: 8px;

      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;

      overflow: hidden;
      white-space: nowrap;

      div.labelWrapper {
        user-select: none;
        max-width: 75%;
      }

      &.found {
        background-color: color.adjust($surface, $lightness: +5%);
      }
    }
  }
</style>
