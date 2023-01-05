<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { derivePrimaryImagePath } from '$lib/utils/characters';

  export let data: import('./$types').PageData;

  const { character } = data;
  const { '@expand': expand, name, bio, gender, age, height, weight } = character;

  const image = derivePrimaryImagePath(character);
  const race = $t(`common.races.${expand.race?.name}`);
  const archetype = $t(`common.archetypes.${expand.archetype?.name}`);
  const background = $t(`common.backgrounds.${expand.background?.name}`);
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
      <textarea spellcheck="false">{bio}</textarea>
    </div>
  </div>
</main>

<style lang="scss">
  @use 'sass:color';
  $mobile: 'max-width: 599px';

  main {
    flex: 1;

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
      background-color: #000000b3;
      padding: 16px;
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr 2fr;

      @media ($mobile) {
        grid-template-columns: auto;
        grid-template-rows: auto 1fr;
      }

      .left-column {
        display: flex;
        flex-direction: column;
        gap: 16px;

        img {
          user-select: none;
          aspect-ratio: 1/1;
          width: 320px;

          @media ($mobile) {
            width: 100%;
            max-width: 380px;
          }
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

      .right-column {
        overflow: hidden;
        display: flex;

        textarea {
          flex: 1;
          padding: 0 8px 16px 0;
          line-height: 1.3;
          margin-top: -4px;

          color: inherit;
          font-size: inherit;
          font-family: inherit;

          background: none;
          border: none;
          outline: none;
          resize: none;
        }
      }
    }
  }
</style>
