<script lang="ts">
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import { t } from '$lib/locales/translations';

  export let href: string;
</script>

<ActionButton {href}>
  <Wrapper>
    <ArrowRight width={32} />
    <Tooltip>{$t('common.gallery.showDetails')}</Tooltip>
  </Wrapper>
</ActionButton>
