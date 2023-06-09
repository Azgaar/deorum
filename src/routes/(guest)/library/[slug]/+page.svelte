<script lang="ts">
  import CharacterDetails from '$lib/components/characters/details/CharacterDetails.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<CharacterDetails item={data.item} />
