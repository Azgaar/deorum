<script lang="ts">
  import Grid from '$lib/components/statistics/Grid.svelte';
  import type { IStatistics } from './+page.server';

  export let data: { statistics: IStatistics[] };
</script>

<Grid {data} type="tags" />
