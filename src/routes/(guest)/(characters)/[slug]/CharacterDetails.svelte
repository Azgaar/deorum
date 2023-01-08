<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { getGenderIcon } from '$lib/utils/characters';
  import { capitalize } from '$lib/utils/string';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;
</script>

<div class="desktop">
  <div class="item">
    <div>{item.name}</div>
    <div>{$t(`common.genders.${item.gender}`)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.race')}</div>
    <div>{$t(`common.races.${item.race}`)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.archetype')}</div>
    <div>{$t(`common.archetypes.${item.archetype}`)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.background')}</div>
    <div>{$t(`common.backgrounds.${item.background}`)}</div>
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

<div class="mobile">
  <div class="item">
    <div><b>{item.name}</b></div>
    <div>{capitalize(item.race)} {getGenderIcon(item.gender)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.archetype')}: {item.archetype}</div>
    <div>{$t('common.character.background')}: {item.background}</div>
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

<style lang="scss">
  .desktop {
    display: none;
    @media (min-width: 600px) {
      display: flex;
      gap: 16px;
      flex-direction: column;
    }
  }

  .mobile {
    display: none;
    @media (max-width: 599px) {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }
  }

  .item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
</style>
