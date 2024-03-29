<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Label from '$lib/components/label/Label.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import type { ICharacter, IRace } from '$lib/types/api.types';

  export let model: ICharacter;

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;

  export let handleClearSelection: VoidFunction;
  export let selectedImages: number;
  export let image: string;
  export let handleEdit = () => {};

  const getImageSrcs = (current: ICharacter) => {
    const portraits = current?.['@expand']?.portraits || [];
    const images = portraits.map(({ id, image }) => `${PORTRAITS_IMAGE_PATH}/${id}/${image}`);
    return images;
  };
</script>

<section class="editor">
  <header>
    <img src={image} alt="preview" class:multiple={selectedImages > 1} />
    <svg class="selectedImages">
      <text x="33%" y="80%">{selectedImages > 1 ? selectedImages : ''}</text>
    </svg>
  </header>

  {#key model}
    <main class="editor">
      <div class="grid">
        <div>{$t('common.character.name')}:</div>
        <div>{model.name}</div>
      </div>

      <div class="grid">
        <div>{$t('common.character.gender')}:</div>
        <Label maxWidth="125px" label={{ name: model.gender }} module="common" type="genders" />
      </div>

      <div class="grid">
        <div>{$t('common.character.race')}:</div>
        <Label
          maxWidth="125px"
          label={{ name: races.get(model.race)?.name }}
          module="common"
          type="races"
        />
      </div>

      <div class="grid">
        <div>{$t('common.character.archetype')}:</div>
        <Label
          maxWidth="125px"
          label={{ name: archetypes.get(model.archetype)?.name }}
          module="common"
          type="archetypes"
        />
      </div>

      <div class="grid">
        <div>{$t('common.character.background')}:</div>
        <Label
          maxWidth="125px"
          label={{ name: backgrounds.get(model.background)?.name }}
          module="common"
          type="backgrounds"
        />
      </div>

      <div class="grid">
        <div>{$t('common.character.bio')}:</div>
        <div class="clamp">{model.bio}</div>
      </div>

      <div class="vertical">
        <div>{$t('admin.statistics.portraits')}:</div>
        <div class="portraits">
          {#each getImageSrcs(model) as src}
            <img {src} alt="portrait" />
          {/each}
        </div>
      </div>
    </main>
  {/key}

  <footer>
    <BasicButton onClick={handleClearSelection}>
      {$t('common.controls.clear')}
    </BasicButton>

    <BasicButton onClick={handleEdit}>
      {$t('common.controls.edit')}
    </BasicButton>
  </footer>
</section>

<style lang="scss">
  section.editor {
    overflow: hidden;
    height: calc(100% - 3rem);
    padding: 1.5rem;
    backdrop-filter: brightness(0.8) grayscale(0.6) sepia(0.4);

    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    @media ($mobile) {
      height: auto;
    }

    header {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;

      img {
        height: 100%;
        width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
        border-radius: 0.5rem;
      }

      svg.selectedImages {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(40%, -40%);
        font-size: 2rem;
        border-radius: 50%;
        width: 5rem;
        height: 5rem;
        font-weight: 500;
        text-anchor: middle;
        fill: $text;
        background-color: $surface;

        transition: opacity 0.2s ease-in-out;
        opacity: 0;
      }

      img.multiple + svg.selectedImages {
        opacity: 0.6;
      }
    }

    main {
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      div.grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;

        .clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }

      div.vertical {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;

        .portraits {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;

          img {
            height: 100%;
            width: 100%;
            border-radius: 4px;
          }
        }
      }
    }

    footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      flex: 1;
      align-items: end;
    }
  }
</style>
