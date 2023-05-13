<script lang="ts">
  export let value: number;
  export let min: number = 0;
  export let max: number = Infinity;
  export let step: number = 1;
</script>

<input type="number" bind:value {min} {max} {step} />

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
