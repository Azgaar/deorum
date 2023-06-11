<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let element: { id: string; name: string; image?: string } | undefined;
  export let translationPath: string;
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
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  span {
    font-size: 0.8em;
    max-width: 120px;
    padding: 4px 8px;
    border-radius: 1em;
    background-color: rgb($on-surface, 0.9);
    white-space: nowrap;
  }
</style>
