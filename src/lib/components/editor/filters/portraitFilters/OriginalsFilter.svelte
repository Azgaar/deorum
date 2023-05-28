<script lang="ts">
  import { tooltip } from '$lib/scripts/tooltip';
  import { t } from '$lib/locales/translations';
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';

  export let isOpen: boolean;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  let search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) entries;

    const regex = new RegExp(search, 'i');
    return entries?.filter(([, { name }]) => regex.test($t(`admin.originals.${name}`)));
  };

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
      <span>{$t('common.controls.select')} {$t(`admin.editor.originals`).toLowerCase()}</span>
      <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
    </div>
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        {#each found as [entryId, { image, name }] (entryId)}
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label
            class:selected={selected.includes(entryId)}
            use:tooltip
            title={$t(`admin.originals.${name}`)}
          >
            <img src={image} alt={name} />
            <div class="checkbox">
              <Checkbox name={entryId} checked={selected.includes(entryId)} />
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

  form {
    width: min(500px, 80vw);

    div.content {
      padding: 0;
      height: min(580px, 75vh);
      overflow-y: auto;

      display: grid;
      grid-template-columns: repeat(auto-fill, 80px);
      grid-auto-rows: 80px;
      grid-gap: 3px;

      @media ($mobile) {
        grid-template-columns: repeat(auto-fill, 58px);
        grid-auto-rows: 58px;
        grid-gap: 2px;
      }

      label {
        position: relative;
        cursor: pointer;

        .checkbox {
          position: absolute;
          right: 0;
          bottom: 0;
        }

        img {
          width: 100%;
          aspect-ratio: 1;

          transition: filter 0.2s ease-in-out;
          filter: brightness(0.9);

          &:hover {
            filter: brightness(0.95);
          }
        }
      }
    }
  }
</style>
