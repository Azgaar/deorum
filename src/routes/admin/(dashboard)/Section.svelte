<script lang="ts">
  import Chart from './Chart.svelte';

  export let header: string;
</script>

<section>
  <h1>{header}</h1>

  <slot />
</section>

<style lang="scss">
  section {
    margin: 20px;

    h1 {
      margin: 0 0 10px;
      font-size: 18px;
    }
  }
</style>
