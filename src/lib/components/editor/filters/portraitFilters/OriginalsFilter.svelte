<script lang="ts">
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';

  export let open: boolean;
  export let original: string[];

  export let entries: [string, { image: string; name: string }][];
  $: search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) entries;

    const regex = new RegExp(search, 'i');
    return entries?.filter(([, { name }]) => regex.test($t(`admin.originals.${name}`)));
  };

  const handleSelect = (originalId: string) => () => {
    original = original.includes(originalId)
      ? original.filter((id) => id !== originalId)
      : [...original, originalId];
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    open = false;
  };
</script>

<Dialog
  bind:open
  class="editorDialog"
  aria-labelledby="originals-filter"
  aria-describedby="originals-filter"
>
  <div class="title">
    <span>{$t('common.controls.select')} {$t(`admin.editor.originals`).toLowerCase()}</span>
    <input type="search" bind:value={search} placeholder={$t('common.controls.search')} />
  </div>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      {#each found as [entryId, { image, name }] (entryId)}
        <div class:selected={original.includes(entryId)}>
          <img on:click={handleSelect(entryId)} src={image} alt={name} />
          <Wrapper>
            <span class="checkmark" />
            <Tooltip>{$t(`admin.originals.${name}`)}</Tooltip>
          </Wrapper>
        </div>
      {/each}
    </div>

    <Actions>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.close')}</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1rem;
    width: min(500px, 90vw);

    div.content {
      height: min(580px, 90vh);

      display: grid;
      grid-template-columns: repeat(auto-fill, 80px);
      grid-auto-rows: 80px;
      grid-gap: 3px;
      padding: 0;

      div {
        position: relative;
        cursor: pointer;

        img {
          width: 100%;
          aspect-ratio: 1;

          transition: filter 0.2s ease-in-out;
          filter: brightness(0.9);

          &:hover {
            filter: brightness(0.95);
          }
        }

        .checkmark {
          position: absolute;
          bottom: 2px;
          right: 2px;

          display: flex;
          justify-content: center;
          align-items: center;

          background-color: color.adjust($surface, $alpha: -0.4);
          border-radius: 50%;
          width: 24px;
          height: 24px;

          transition: all 0.2s ease-in-out;
          opacity: 0;

          &::after {
            content: '✓';
            color: $text;
            font-size: 1.2rem;
          }
        }

        &.selected {
          .checkmark {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
