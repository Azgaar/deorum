<script lang="ts">
  export let onClick: () => void;
</script>

<button type="button" on:click={onClick}>🎲</button>

<style lang="scss">
  button {
    width: min-content;
    border: none;
    color: $text;
    font-size: 1rem;
    text-align: left;

    cursor: pointer;
    padding: 0.1em 0.3em;
    background: rgba($secondary, 0.5);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
  }

  button:hover {
    background: rgba($secondary, 0.6);
  }
</style>
