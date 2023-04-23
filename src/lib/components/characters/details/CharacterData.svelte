<script lang="ts">
  import View from '$lib/components/mediaQuery/View.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const undefinedLabel: string = $t('common.values.undefined');
  function tr(path: string, value: string) {
    return $t(`${path}.${value}`, { default: value || undefinedLabel });
  }
</script>

<View>
  <div slot="desktop">
    <div class="item">
      <div class="name">{item.name || $t('common.values.unnamed')}</div>
      <div>{tr('common.genders', item.gender)}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.race')}</div>
      <div>{tr('common.races', item.race)}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.archetype')}</div>
      <div>{tr('common.archetypes', item.archetype)}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.background')}</div>
      <div>{tr('common.backgrounds', item.background)}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.age')}</div>
      <div>{item.age} {$t('common.metrics.yearsOld')}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.height')}</div>
      <div>{item.height} {$t('common.metrics.cm')}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.weight')}</div>
      <div>{item.weight} {$t('common.metrics.kg')}</div>
    </div>
  </div>

  <div slot="mobile">
    <div class="item">
      <div><b>{item.name || $t('common.values.unnamed')}</b></div>
      <div class="capitalize">
        <span>{tr('common.genders', item.gender)}</span>
        {tr('common.races', item.race)}
      </div>
    </div>

    <div class="item">
      <div>{$t('common.character.archetype')}: {tr('common.archetypes', item.archetype)}</div>
      <div>{$t('common.character.background')}: {tr('common.backgrounds', item.background)}</div>
    </div>

    <div class="item">
      <div>{$t('common.character.age')}: {item.age}</div>
      <div>
        {$t('common.character.height')}: {item.height}
        {$t('common.metrics.cm')}
        {@html '&emsp;'}
        {$t('common.character.weight')}: {item.weight}
        {$t('common.metrics.kg')}
      </div>
    </div>
  </div>
</View>

<style lang="scss">
  div[slot='desktop'] {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }

  div[slot='mobile'] {
    display: flex;
    gap: 8px;
    flex-direction: column;

    .capitalize {
      text-transform: capitalize;
    }
  }

  .item {
    display: flex;
    justify-content: space-between;
    gap: 8px;

    .name {
      font-weight: bold;
    }
  }
</style>
