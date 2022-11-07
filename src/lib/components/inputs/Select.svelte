<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let value: string;
  export let options: string[][];
  export let onChange: (value: string) => void;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    value = target.value;
    onChange(value);
  };
</script>

<select {value} on:change={handleChange}>
  {#each options as [value, label]}
    <option {value}>{$t(label)}</option>
  {/each}
</select>

<style lang="scss">
  select {
    outline: none;
    border: none;
    border-radius: 16px;
    height: 23px;
    text-indent: 6px;
    min-width: 60px;
    font-size: 1rem;

    color: $text;
    background-color: rgba($secondary, 0.5);
  }
</style>
