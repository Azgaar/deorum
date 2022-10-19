<script lang="ts">
  import Grid from '$lib/components/statistics/Grid.svelte';
  import type { IStatistics } from '$lib/types/statistics.types';

  export let data: { statistics: IStatistics[] };
</script>

<Grid {data} type="styles" />
