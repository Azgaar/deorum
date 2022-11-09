<script lang="ts">
  import Portrait from './Portrait.svelte';

  export let ids: string[];

  const handleRemove = (id: string) => () => {
    ids = ids.filter((elementId) => elementId !== id);
  };
</script>

<div class="portraits">
  <div class="gallery">
    {#each ids as id (id)}
      <Portrait {id} onClick={handleRemove(id)} />
    {/each}
  </div>
  <div class="add">
    <span>+</span>
  </div>
</div>

<style lang="scss">
  div.portraits {
    padding-bottom: 8px;

    display: grid;
    gap: 8px;
    grid-template-columns: 1fr auto;

    .gallery {
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }

    .add {
      width: 64px;
      height: 64px;
      border-radius: 4px;
      background-color: $secondary;
      transition: background-color 0.2s ease-in-out;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: rgba($secondary, 0.6);
      }
    }
  }
</style>
