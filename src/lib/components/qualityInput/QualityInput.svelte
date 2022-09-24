<script lang="ts">
  import './_styles.scss';

  export let quality: number;
  export let onChange = (_: number) => {};

  const values = Array(11)
    .fill(0)
    .map((_, i) => i);

  const handleChange = (value: number) => () => {
    onChange(value);
  };
</script>

<div class="quality">
  {#each values as value}
    <button class:active={value <= quality} on:click={handleChange(value)}>
      <span class:current={value === quality}>{value}</span>
    </button>
  {/each}
</div>
