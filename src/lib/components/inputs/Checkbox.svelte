<script lang="ts">
  export let checked: boolean = false;
  export let onChange: (e: Event) => void = () => {};
  export let name: string = '';
  export let disabled: boolean = false;
</script>

<input type="checkbox" {checked} {name} {disabled} on:change={onChange} />

<style lang="scss">
  input {
    width: 16px;
    height: 16px;
    accent-color: $secondary;
    filter: brightness(80%);
    cursor: pointer;
  }
</style>
