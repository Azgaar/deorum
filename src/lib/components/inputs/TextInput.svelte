<script lang="ts">
  export let value: string;
  export let onChange: (value: string) => void;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    value = target.value;
    onChange(value);
  };
</script>

<input type="text" {value} on:change={handleChange} />

<style lang="scss">
  input {
    outline: none;
    border: none;
    border-radius: 16px;
    height: 21px;
    text-indent: 6px;
    min-width: 60px;

    color: $text;
    background-color: rgba($secondary, 0.5);
  }
</style>
