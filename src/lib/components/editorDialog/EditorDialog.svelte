<script lang="ts">
  import Dialog, { Title, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import './_styles.scss';

  export let open: boolean;
  export let title: string;
  export let entries: [string, string][];
  export let selected: string[];

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const element = event.target as HTMLElement;
    if (element.classList.contains('content')) return;
    element.querySelector('input')?.click();
  };
</script>

<Dialog
  class="editorDialog"
  bind:open
  aria-labelledby="editor-dialog"
  aria-describedby="editor-dialog"
>
  <Title>{title}</Title>

  <div>
    <div class="content" on:click={handleClick}>
      {#each entries as [entryId, entryText] (entryId)}
        <div class="entry" data-id={entryId}>
          <Checkbox bind:group={selected} value={entryId} ripple={false} />
          <span>{@html entryText}</span>
        </div>
      {/each}
    </div>

    <Actions>
      <Button on:click={() => (open = false)}>
        <Label>Close</Label>
      </Button>
    </Actions>
  </div>
</Dialog>
