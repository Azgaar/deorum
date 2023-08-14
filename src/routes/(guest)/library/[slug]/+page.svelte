<script lang="ts">
  import CharacterDetails from '$lib/components/characters/details/CharacterDetails.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { trimText } from '$lib/utils/string';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${data.item.name}`}
  description={trimText(data.item.bio, 250)}
  imageSrc={`${PORTRAITS_IMAGE_PATH}/${data.item.image}`}
/>
<CharacterDetails item={data.item} />
