<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let element: { id: string; name: string; image?: string } | undefined;
  export let translationPath: string;

  $: console.log(element);
</script>

{#if element?.image}
  <img
    alt={element.id}
    src={element.image}
    use:tooltip
    title={$t(`${translationPath}.${element.name}`)}
  />
{:else if element?.name}
  <span>{$t(`${translationPath}.${element.name}`)}</span>
{:else}
  <span>{$t('common.values.undefined')}</span>
{/if}

<style lang="scss">
  @use 'sass:color';

  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  span {
    font-size: 0.85em;
    max-width: 150px;
    padding: 0.4em 1em;
    border-radius: 1em;
    background-color: color.adjust($on-surface, $alpha: -0.1);
    white-space: nowrap;
  }
</style>
