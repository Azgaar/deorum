<script lang="ts">
  import Chart from './Chart.svelte';
  import Section from './Section.svelte';

  export let header: string;
  export let data: [string, number][];
</script>

<Section {header}>
  <Chart {data} />

  <div class="dataPoints">
    <slot />
  </div>
</Section>

<style lang="scss">
  .dataPoints {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 10px;
    font-size: 14px;
    color: $text;
  }
</style>
