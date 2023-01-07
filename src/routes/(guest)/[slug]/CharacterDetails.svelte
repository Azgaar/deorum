<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { getGenderIcon } from '$lib/utils/characters';
  import { capitalize } from '$lib/utils/string';
  import type { ICharacter } from '$lib/types/api.types';

  export let character: ICharacter;

  const { '@expand': expand, name, gender, age, height, weight } = character;
  const race = $t(`common.races.${expand.race?.name}`);
  const archetype = $t(`common.archetypes.${expand.archetype?.name}`);
  const background = $t(`common.backgrounds.${expand.background?.name}`);
</script>

<div class="desktop">
  <div class="item">
    <div>{name}</div>
    <div>{$t(`common.genders.${gender}`)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.race')}</div>
    <div>{race}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.archetype')}</div>
    <div>{archetype}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.background')}</div>
    <div>{background}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.age')}</div>
    <div>{age} {$t('common.metrics.yearsOld')}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.height')}</div>
    <div>{height} {$t('common.metrics.cm')}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.weight')}</div>
    <div>{weight} {$t('common.metrics.kg')}</div>
  </div>
</div>

<div class="mobile">
  <div class="item">
    <div><b>{name}</b></div>
    <div>{capitalize(race)} {getGenderIcon(gender)}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.archetype')}: {archetype}</div>
    <div>{$t('common.character.background')}: {background}</div>
  </div>

  <div class="item">
    <div>{$t('common.character.age')}: {age}</div>
    <div>
      {$t('common.character.height')}: {height}
      {$t('common.metrics.cm')}
      {@html '&emsp;'}
      {$t('common.character.weight')}: {weight}
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
