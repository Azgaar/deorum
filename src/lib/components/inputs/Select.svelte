<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let value: string;
  export let onChange = (value: string) => {};
  export let options: string[][];
  export let style: string | null = null;

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onChange(target.value);
  };
</script>

<select bind:value on:change={handleChange} {style}>
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
    background-color: rgb($secondary, 0.6);
  }
</style>
