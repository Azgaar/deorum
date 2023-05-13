<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let value: string;
  export let onChange = (value: string) => {};
  export let options: string[][];

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onChange(target.value);
  };
</script>

<select bind:value on:change={handleChange}>
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
    width: 100%;
    font-size: 14px;
    padding-right: 4px;

    color: $text;
    background-color: rgba($secondary, 0.6);
  }
</style>
