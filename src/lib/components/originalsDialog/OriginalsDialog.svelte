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
            <img src={`${path}/${entryId}/${image}?thumb=100x100`} alt={name} />
            {name}
          </label>
        </div>
      {/each}
    </div>

    <Actions>
      <Button style="color: white" on:click={handleCancel}>
        <Label>Cancel</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>Apply</Label>
      </Button>
    </Actions>
  </form>
</Dialog>
