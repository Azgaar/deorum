<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';

  export let open: boolean;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string;
  export let onSubmit: (newOrigin: string) => void;

  $: search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test($t(`admin.originals.${name}`)));
    return new Map(filtered);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const value = new FormData(event.target as HTMLFormElement).get('original');
    if (value && typeof value === 'string') {
      onSubmit(value);
      open = false;
      search = '';
    }
  };

  const handleCancel = () => {
    open = false;
    search = '';
  };
</script>

<Dialog bind:open aria-labelledby="editor-dialog" aria-describedby="editor-dialog">
  <div class="title">
    <span>{$t('common.controls.select')} {$t('admin.editor.original').toLowerCase()}</span>
    <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
  </div>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      {#each entries || [] as [entryId, { image, name }] (entryId)}
        <div class:found={found.has(entryId)}>
          <input
            type="radio"
            name="original"
            id={entryId}
            value={entryId}
            checked={selected === entryId}
          />
          <label for={entryId}>
            <img src={image} alt={name} />
            {$t(`admin.originals.${name}`)}
          </label>
        </div>
      {/each}
    </div>

    <Actions>
      <Button style="color: white" on:click={handleCancel}>
        <Label>{$t('common.controls.cancel')}</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.apply')}</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  div.title {
    display: flex;
    height: 40px;
    font-size: large;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;

    span {
      padding-left: 10px;
    }

    input {
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
    padding: 0 1rem 0 1.6rem;
    max-height: 80vh;
    overflow: auto;

    > div {
      input[type='radio'] {
        display: none;
      }

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
