<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';

  export let open: boolean;
  export let original: string[];

  export let path: string;
  export let entries: [string, { image: string; name: string }][];

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

<Dialog bind:open aria-labelledby="originals-filter" aria-describedby="originals-filter">
  <Title>{$t('common.controls.select')} {$t('admin.editor.originals').toLowerCase()}</Title>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      {#each entries as [entryId, { image, name }] (entryId)}
        <div class:selected={original.includes(entryId)}>
          <img
            on:click={handleSelect(entryId)}
            src={`${path}/${entryId}/${image}?thumb=100x100`}
            alt={name}
          />
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
  form.body {
    padding: 0 1.5rem;
    width: min(500px, 90vw);
  }

  div.content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    grid-gap: 3px;

    div {
      filter: brightness(0.6) grayscale(0.8);
      transition: filter 0.2s ease-in-out;
      cursor: pointer;
    }

    div:hover {
      filter: brightness(0.6);
    }

    div.selected {
      filter: brightness(1);
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
