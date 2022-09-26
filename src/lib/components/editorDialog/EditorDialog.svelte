<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import './_styles.scss';

  export let open: boolean;
  export let title: string;
  export let entries: [string, string][];
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  $: current = structuredClone(selected);
  $: search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, name]) => regex.test(name));
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
    <span>{title}</span>
    <input type="search" bind:value={search} placeholder="Search" />
  </div>

  <div>
    <div class="content" on:click={handleChange}>
      {#each entries || [] as [entryId, entryText] (entryId)}
        <div class="entry" class:found={found.has(entryId)}>
          <Checkbox group={current} value={entryId} ripple={false} />
          <span>{@html entryText}</span>
        </div>
      {/each}
    </div>

    <Actions>
      <Button style="color: white" on:click={handleCancel}>
        <Label>Cancel</Label>
      </Button>
      <Button style="color: white" on:click={handleApply}>
        <Label>Apply</Label>
      </Button>
    </Actions>
  </div>
</Dialog>
