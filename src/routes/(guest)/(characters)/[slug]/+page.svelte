<script lang="ts">
  import type { Carousel } from '$lib/components/characters/carousel';
  import CharacterDetails from '$lib/components/characters/details/CharacterDetails.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { trimText } from '$lib/utils/string';
  import { getContext } from 'svelte';

  const { currentItem: item } = getContext<Carousel>('carousel');
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${$item.name}`}
  description={trimText($item.bio, 250)}
  imageSrc={`${PORTRAITS_IMAGE_PATH}/${$item.image}`}
/>
<CharacterDetails item={$item} />
