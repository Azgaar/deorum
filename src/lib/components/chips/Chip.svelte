<script lang="ts">
  import Label from '$lib/components/label/Label.svelte';

  export let chip: IChip | undefined;
  export let type: string;
  export let handleRemove: () => void;

  interface IChip {
    image: string;
    name: string;
  }
</script>

<span class="chip">
  <span on:click={handleRemove} class="action">✕</span>
  <Label label={chip} {type} />
</span>

<style lang="scss">
  span.chip {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding: 0.1em 0.5em 0.1em 0.2em;
    background: rgba($surface, 0.35);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;

    span.action {
      position: absolute;
      padding: 0em 0.2em;
      margin: 1px 0 0 -1px;
      opacity: 0;
      border-radius: 16px;
      background-color: rgba($surface, 0.5);
    }
  }

  span.chip:hover {
    background: rgba($surface, 0.4);

    span.action {
      opacity: 1;
    }

    span.action:hover {
      background-color: rgba($surface, 0.6);
    }
  }

  span.chip:active {
    background: rgba($surface, 0.4);
  }

  span.action {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
</style>
