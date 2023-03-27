<script lang="ts">
  import ActionButton from '$lib/components/actions/ActionButton.svelte';
  import ArrowDown from '$lib/components/icons/ArrowDown.svelte';
  import Braces from '$lib/components/icons/Braces.svelte';
  import Card from '$lib/components/icons/Card.svelte';
  import Text from '$lib/components/icons/Text.svelte';
  import User from '$lib/components/icons/User.svelte';
  import { clickOutside } from '$lib/events/clickOutside';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { fly } from 'svelte/transition';
  import { exportChar } from './export';

  export let item: IGalleryItem;

  let show = false;
  const open = () => (show = true);
  const close = () => (show = false);
</script>

{#if show}
  <div
    transition:fly={{ x: 0, y: 40, duration: 200 }}
    class="options"
    use:clickOutside
    on:clickOutside={close}
    on:click={close}
    on:keydown={close}
  >
    <ActionButton
      onClick={exportChar(item, 'portrait')}
      title={$t('common.details.export.portrait')}
    >
      <User width={28} />
    </ActionButton>

    <ActionButton
      onClick={exportChar(item, 'cardImage')}
      title={$t('common.details.export.cardImage')}
    >
      <Card width={28} />
    </ActionButton>

    <ActionButton onClick={exportChar(item, 'text')} title={$t('common.details.export.text')}>
      <Text width={28} />
    </ActionButton>

    <ActionButton onClick={exportChar(item, 'json')} title={$t('common.details.export.json')}>
      <Braces width={28} />
    </ActionButton>
  </div>
{/if}

<ActionButton onClick={open} isActive={show} title={$t('common.controls.download')}>
  <ArrowDown width={28} rotate={show} />
</ActionButton>

<style lang="scss">
  @use 'sass:color';

  .options {
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;

    display: flex;
    flex-direction: column;
    gap: 2px;

    border-radius: 20px;
    background: color.adjust($on-surface, $alpha: -0.6);
  }
</style>
