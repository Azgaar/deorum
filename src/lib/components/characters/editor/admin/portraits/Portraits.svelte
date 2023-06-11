<script lang="ts">
  import Portrait from './Portrait.svelte';
  import PortraitsDialog from './PortraitsDialog.svelte';

  export let ids: string[];

  let isSelectDialogOpen = false;

  const moveLeft = (id: string) => {
    const index = ids.indexOf(id);
    if (index === 0) return;
    ids = [...ids.slice(0, index - 1), id, ids[index - 1], ...ids.slice(index + 1)];
  };

  const moveRight = (id: string) => {
    const index = ids.indexOf(id);
    if (index === ids.length - 1) return;
    ids = [...ids.slice(0, index), ids[index + 1], id, ...ids.slice(index + 2)];
  };

  const makeFirst = (id: string) => {
    const index = ids.indexOf(id);
    if (index === 0) return;
    ids = [id, ...ids.slice(0, index), ...ids.slice(index + 1)];
  };

  const makeLast = (id: string) => {
    const index = ids.indexOf(id);
    if (index === ids.length - 1) return;
    ids = [...ids.slice(0, index), ...ids.slice(index + 1), id];
  };

  const remove = (id: string) => {
    ids = ids.filter((elementId) => elementId !== id);
  };

  const actions = { makeFirst, moveLeft, remove, moveRight, makeLast };
</script>

<div class="portraits">
  <div class="gallery">
    {#each ids as id (id)}
      <Portrait {id} {actions} />
    {/each}
  </div>

  <button class="add" type="button" on:click={() => (isSelectDialogOpen = true)}>+</button>
</div>

<PortraitsDialog
  bind:isOpen={isSelectDialogOpen}
  {ids}
  onSubmit={(newIds) => (ids = [...ids, ...newIds])}
/>

<style lang="scss">
  div.portraits {
    display: grid;
    gap: 4px;
    grid-template-columns: 1fr auto;

    .gallery {
      display: flex;
      gap: 4px;
      overflow-x: auto;
    }

    .add {
      border: 0;
      width: 50px;
      height: 50px;
      border-radius: 4px;
      color: rgb($text, 0.6);
      background-color: rgb($secondary, 0.6);
      transition: all 0.2s ease-in-out;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: $text;
        background-color: $secondary;
      }
    }
  }
</style>
