<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import { t } from '$lib/locales/translations';
  import { fade } from 'svelte/transition';

  export let href: string;
  export let actionable: boolean;
</script>

<ActionButton {href}>
  <div>
    {#if actionable}
      <div transition:fade>
        <span>{$t('common.gallery.showDetails')}</span>
        <ArrowRight width={20} />
      </div>
    {/if}
  </div>
</ActionButton>

<style lang="scss">
  div {
    min-height: 24px;
    display: flex;
    align-items: center;

    div {
      padding: 0 4px 0 10px;
      text-transform: uppercase;
    }
  }
</style>
