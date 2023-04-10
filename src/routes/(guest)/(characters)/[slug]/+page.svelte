<script lang="ts">
  import type { Carousel } from '$lib/components/characters/carousel';
  import CharacterDetails from '$lib/components/characters/details/CharacterDetails.svelte';
  import { getContext } from 'svelte';

  const { currentItem: item } = getContext<Carousel>('carousel');
</script>

<CharacterDetails item={$item} />
