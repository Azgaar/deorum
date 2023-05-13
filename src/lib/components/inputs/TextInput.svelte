<script lang="ts">
  export let value: string;
</script>

<input type="text" bind:value />

<style lang="scss">
  input {
    outline: none;
    border: none;
    border-radius: 16px;
    height: 21px;
    text-indent: 6px;
    width: 100%;

    color: $text;
    background-color: rgba($secondary, 0.6);
  }
</style>
