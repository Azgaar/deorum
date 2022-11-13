<script lang="ts">
  export let value: number;
  export let onChange: (value: number) => void;
  export let min: number = 0;
  export let max: number = Infinity;
  export let step: number = 1;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    value = Number(target.value);
    onChange(value);
  };
</script>

<input type="number" {value} {min} {max} {step} on:change={handleChange} />

<style lang="scss">
  input {
    outline: none;
    border: none;
    border-radius: 16px;
    height: 21px;
    text-indent: 6px;
    width: 100%;

    color: $text;
    background-color: rgba($secondary, 0.5);
  }
</style>
