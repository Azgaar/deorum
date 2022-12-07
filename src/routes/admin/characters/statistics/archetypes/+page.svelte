<script lang="ts">
  import Grid from '$lib/components/statistics/Grid.svelte';

  export let data: import('./$types').PageData;
</script>

<Grid {data} module="common" type="archetypes" />
