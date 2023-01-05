<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { derivePrimaryImagePath } from '$lib/utils/characters';

  export let data: import('./$types').PageData;

  const { character } = data;
  const { '@expand': expand, name, gender, age, height, weight, bio } = character;

  const image = derivePrimaryImagePath(character);
  const race = $t(`common.races.${expand.race?.name}`);
  const archetype = $t(`common.archetypes.${expand.archetype?.name}`);
  const background = $t(`common.backgrounds.${expand.background?.name}`);

  const bioHtml =
    '<p style="margin-block-start: 0">' +
    bio.replace(/\n([ \t]*\n)+/g, '</p><p>').replace('\n', '<br />') +
    '</p>';
  console.log(data);
</script>

<main>
  <div class="container">
    <div class="left-column">
      <img src={image} alt="Character portrait" draggable="false" />
      <div class="list">
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
    </div>
    <div class="right-column">
      {@html bioHtml}
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';
  $mobile: 'max-width: 599px';

  main {
    overflow-y: auto;

    padding: 16px 32px;
    display: flex;
    justify-content: center;

    @media ($mobile) {
      padding: 0;
    }

    font-size: 14px;
    font-family: Helvetica, sans-serif;
    color: #dee7ea;

    .container {
      max-width: 1300px;
      height: max-content;
      background-color: #170904d9;

      padding: 16px;
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 320px 1fr;
      justify-items: center;

      @media ($mobile) {
        grid-template-columns: minmax(200px, 380px);
        grid-template-rows: auto 1fr;
      }

      .left-column {
        display: flex;
        flex-direction: column;
        gap: 16px;

        img {
          user-select: none;
          aspect-ratio: 1/1;
          width: 100%;
        }

        .list {
          display: flex;
          gap: 16px;
          flex-direction: column;

          .item {
            display: flex;
            justify-content: space-between;
            gap: 8px;
          }
        }
      }
    }
  }
</style>
