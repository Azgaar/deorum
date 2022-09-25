<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import './_styles.scss';

  export let path: string;
  export let open: boolean;
  export let entries: [string, { image: string; name: string }][];
  export let selected: string;
  export let onSubmit: (newOrigin: string) => void;

  $: search = '';
  $: found = handleSearch(search);

  const handleSearch = (search: string) => {
    if (!search) return new Map();

    const regex = new RegExp(search, 'i');
    const filtered = entries?.filter(([, { name }]) => regex.test(name));
    return new Map(filtered);
  };

  const handleChange = (event: MouseEvent) => {
    event.stopPropagation();
    const element = event.target as HTMLElement;
    if (element.classList.contains('content')) return;

    const entry = element.dataset.id;
    if (entry) selected = entry;
  };

  const handleCancel = () => {
    open = false;
    search = '';
  };

  const handleApply = () => {
    onSubmit(selected);
    open = false;
    search = '';
  };
</script>

<Dialog
  class="originsDialog"
  bind:open
  aria-labelledby="editor-dialog"
  aria-describedby="editor-dialog"
>
  <div class="title">
    <span>Select original</span>
    <input type="search" bind:value={search} placeholder="Search" />
  </div>

  <div class="body">
    <div class="content" on:click={handleChange}>
      {#each entries || [] as [entryId, { image, name }] (entryId)}
        <div
          class="entry"
          data-id={entryId}
          class:selected={selected === entryId}
          class:found={found.has(entryId)}
        >
          <img src={`${path}/${entryId}/${image}`} alt={name} />
          <span>{@html name}</span>
        </div>
      {/each}
    </div>

    <Actions>
      <Button on:click={handleCancel}>
        <Label>Cancel</Label>
      </Button>
      <Button on:click={handleApply}>
        <Label>Apply</Label>
      </Button>
    </Actions>
  </div>
</Dialog>
