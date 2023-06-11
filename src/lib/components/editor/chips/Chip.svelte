<script lang="ts">
  import Label from '$lib/components/label/Label.svelte';

  export let chip: IChip | undefined;
  export let type: string;
  export let handleRemove: VoidFunction;

  interface IChip {
    image: string;
    name: string;
  }
</script>

<span class="chip">
  <button on:click={handleRemove} class="action">✕</button>
  <Label label={chip} {type} />
</span>

<style lang="scss">
  .chip {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    display: flex;
    align-items: center;

    padding: 0.1em 0.5em 0.1em 0.2em;
    background: rgb($secondary, 0.6);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: rgb($secondary, 0.6);

      .action {
        opacity: 1;
        &:hover {
          background-color: rgb($secondary, 0.6);
        }
      }
    }

    &:active {
      background: rgb($secondary, 0.7);
    }

    .action {
      position: absolute;
      padding: 0;
      border: 0;
      border-radius: 50%;

      width: 16px;
      height: 16px;
      color: $text;
      cursor: pointer;

      transition: all 0.2s ease-in-out;
      opacity: 0;
      background-color: rgb($secondary, 0.7);
    }
  }
</style>
