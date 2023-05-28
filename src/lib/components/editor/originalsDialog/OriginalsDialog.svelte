<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import { t } from '$lib/locales/translations';

  export let isOpen: boolean;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string;
  export let onSubmit: (newOrigin: string) => void;

  let search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test($t(`admin.originals.${name}`)));
    return new Map(filtered);
  };

  const handleCancel = () => {
    isOpen = false;
    search = '';
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const value = new FormData(event.target as HTMLFormElement).get('original');
    if (value && typeof value === 'string') {
      onSubmit(value);
      isOpen = false;
      search = '';
    }
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    <div class="title">
      <span>{$t('common.controls.select')} {$t('admin.editor.original').toLowerCase()}</span>
      <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
    </div>
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        {#each entries || [] as [entryId, { image, name }] (entryId)}
          <div class:found={found.has(entryId)}>
            <input
              type="radio"
              name="original"
              id={entryId}
              value={entryId}
              checked={selected === entryId}
              hidden
            />

            <label for={entryId}>
              <img src={image} alt={name} />
              {$t(`admin.originals.${name}`)}
            </label>
          </div>
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

  div.title {
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

  div.content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px 8px;
    max-height: 80vh;
    overflow: auto;

    > div {
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        img {
          width: 40px;
          height: 40px;
        }

        span {
          pointer-events: none;
          user-select: none;
          text-transform: capitalize;
        }
      }
    }

    > div:has(input[type='radio']:checked) {
      background-color: color.adjust($surface, $lightness: +15%);
    }

    > div:hover {
      background-color: color.adjust($surface, $lightness: +10%);
    }

    > div.found {
      background-color: color.adjust($surface, $lightness: +5%);
    }
  }
</style>
