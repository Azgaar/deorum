<script lang="ts">
  import { page } from '$app/stores';
  import CharacterBio from '$lib/components/characters/details/CharacterBio.svelte';
  import CharacterData from '$lib/components/characters/details/CharacterData.svelte';
  import CharacterPicture from '$lib/components/characters/details/CharacterPicture.svelte';
  import ArrowRight from '$lib/components/icons/ArrowRight.svelte';
  import Metatags from '$lib/components/metatags/Metatags.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { trimText } from '$lib/utils/string';

  const item = $page.data.item;
</script>

<Metatags
  title={`${$t('common.meta.name')} | ${item.name}`}
  description={trimText(item.bio, 250)}
  imageSrc={`${PORTRAITS_IMAGE_PATH}/${item.image}`}
/>

<div class="wrapper">
  <article id="characterCard">
    <section class="content">
      <div class="left-column">
        <CharacterPicture {item} />
        <CharacterData {item} />
      </div>

      <div class="right-column">
        <CharacterBio {item} />
      </div>
    </section>
  </article>

  <a class="seeInDeorum" href={`/${item.id}`} target="_blank">
    <ArrowRight width={18} />
    <span>{$t('common.encounter.seeInDeorum')}</span>
  </a>
</div>

<style lang="scss">
  @use 'sass:color';

  div.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;

    font-size: 14px;
    color: #dee7ea;

    padding: 32px 64px;

    @media ($mobile) {
      height: 100%;
      padding: 0;
    }

    @media (min-width: 1200px) {
      padding: 64px;
    }

    article {
      max-width: 1050px;
      height: max-content;
      background-color: #170904d9;

      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      section.content {
        display: grid;
        justify-items: center;
        grid-gap: 16px;
        grid-template-columns: minmax(auto, 320px) auto;

        @media ($mobile) {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
        }

        .left-column {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .right-column {
          line-height: 1.2;
        }
      }
    }

    a.seeInDeorum {
      position: absolute;
      top: 0.4rem;
      right: 1rem;

      @media ($mobile) {
        top: 1.2rem;
        right: 1.2rem;

        padding: 0.1rem 0.4rem 0.2rem 0.2rem;
        background-color: #170904aa;
        transition: background-color 0.2s ease-in-out;
        border-radius: 20px;

        &:hover {
          background-color: #170904d9;
        }
      }

      color: $text;
      text-decoration: none;

      display: flex;
      justify-content: flex-end;
    }
  }
</style>
