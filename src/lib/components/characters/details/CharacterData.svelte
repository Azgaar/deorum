<script lang="ts">
  import View from '$lib/components/mediaQuery/View.svelte';
  import { t } from '$lib/locales/translations';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import { convertToImperialHeight, convertToImperialWeight } from '$lib/utils/units';

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
      <div class="pair">
        <span>{item.height} {$t('common.metrics.cm')}</span>
        <span>({convertToImperialHeight(item.height)})</span>
      </div>
    </div>

    <div class="item">
      <div>{$t('common.character.weight')}</div>
      <div class="pair">
        <span>{item.weight} {$t('common.metrics.kg')}</span>
        <span>({convertToImperialWeight(item.weight)} {$t('common.metrics.lbs')})</span>
      </div>
    </div>
  </div>

  <div slot="mobile">
    <div class="item">
      <div>
        <span class="name">{item.name || $t('common.values.unnamed')}</span>,
        {item.age}
        {$t('common.metrics.yearsOld')}
      </div>
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
      <div>
        {$t('common.character.height')}:
        <span>{item.height} {$t('common.metrics.cm')}</span>
        <span>({convertToImperialHeight(item.height)})</span>
      </div>

      <div>
        {$t('common.character.weight')}:
        <span>{item.weight} {$t('common.metrics.kg')}</span>
        <span>({convertToImperialWeight(item.weight)} {$t('common.metrics.lbs')})</span>
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

    .pair {
      display: flex;
      gap: 4px;
    }
  }
</style>
