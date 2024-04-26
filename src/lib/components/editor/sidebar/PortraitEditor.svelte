<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Chip from '$lib/components/editor/chips/Chip.svelte';
  import QualityInput from '$lib/components/inputs/QualityInput.svelte';
  import Label from '$lib/components/label/Label.svelte';
  import { PORTRAITS_IMAGE_PATH, charactersConfig } from '$lib/config';
  import { blankCharacter } from '$lib/data/characters';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import { isSameArray } from '$lib/utils/array';
  import { deriveCharacterLabel } from '$lib/utils/characters';
  import { convertFile, convertImageUrl, isConvertableFormat } from '$lib/utils/images';
  import { log, report } from '$lib/utils/log';
  import { makePOJO } from '$lib/utils/object';
  import { getChanges } from '$lib/utils/portraits';
  import { request, sendFormData } from '$lib/utils/requests';
  import EditButton from '../EditButton.svelte';

  import type { ICharacter, IPortrait } from '$lib/types/api.types';
  import type {
    TChangeableKey,
    TDeleteHandler,
    TEditorData,
    TOpenEditCharacterDialog,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TOpenSelectCharacterDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/types/editor.types';

  export let model: TEditorData;
  $: current = makePOJO(model);
  $: fetchCharacters(model.characters);

  export let originals: Map<string, { image: string; name: string }>;
  export let tags: Map<string, { image: string; name: string }>;
  export let styles: Map<string, { image: string; name: string }>;
  export let colors: Map<string, { image: string; name: string }>;

  export let openEditorDialog: TOpenEditorDialog;
  export let openOriginalsDialog: TOpenOriginalsDialog;
  export let openEditCharacterDialog: TOpenEditCharacterDialog;
  export let openSelectCharacterDialog: TOpenSelectCharacterDialog;

  export let handleClearSelection: VoidFunction;
  export let isUploading: boolean;
  export let selectedImages: number;
  export let image: string;

  export let handlePatch: TPatchHandler;
  export let handlePost: TPostHandler;
  export let handleDelete: TDeleteHandler;

  let isChanged = false;
  let isLoading = false;
  let isDeleteInitiated = false;

  $: isConvertable = isConvertableFormat(image);
  $: originalName = originals.get(current.original)?.name;
  $: originalImage = originals.get(current.original)?.image;
  let characters: ICharacter[] = [];

  const fetchCharacters = async (characterIds: string[]) => {
    if (!characterIds.length || isUploading) {
      characters = [];
      return;
    }

    try {
      characters = [];
      const promises = characterIds.map((id) =>
        request<ICharacter>(`/api/characters/${id}?expand=${charactersConfig.expand}`)
      );
      characters = await Promise.all(promises);
    } catch (error) {
      report('portrait editor', error, characterIds);
      toastError(error);
      characters = [];
    }
  };

  const handleRemove = (key: 'styles' | 'colors' | 'tags', id: string) => () => {
    current[key] = current[key].filter((item) => item !== id);
    isChanged = true;
  };

  const handleOriginalChange = () => {
    const onSubmit = (newOriginal: string) => {
      if (current.original !== newOriginal) {
        current.original = newOriginal;
        isChanged = true;
      }
    };

    openOriginalsDialog(current.original, onSubmit);
  };

  const handleCharacterClick = (characterToEdit: ICharacter | null) => () => {
    const onSubmit = (character: ICharacter) => {
      if (characterToEdit) {
        // character is changed
        characters = characters.map((c) => (c.id === character.id ? character : c));
      } else {
        // character is created
        current.characters = [...current.characters, character.id];
        characters = [...characters, character];
      }
    };

    const onDelete = (characterId: string) => {
      current.characters = current.characters.filter((id) => id !== characterId);
      characters = characters.filter(({ id }) => id !== characterId);
    };

    if (characterToEdit) openEditCharacterDialog(characterToEdit, onSubmit, onDelete);
    else {
      const character = makePOJO(blankCharacter);
      character.tags = current.tags;
      openEditCharacterDialog(character, onSubmit, onDelete);
    }
  };

  const handleSelectCharacterClick = () => {
    const onSubmit = (selectedCharacters: ICharacter[]) => {
      const newCharacterIds = selectedCharacters.map(({ id }) => id);
      if (isSameArray(current.characters, newCharacterIds)) return;

      isChanged = true;
      current.characters = newCharacterIds;
      characters = selectedCharacters;
    };

    openSelectCharacterDialog(current.characters, onSubmit);
  };

  const handleValueChange = (attribute: TChangeableKey) => (value: number | string) => {
    if (value !== current[attribute]) {
      (current[attribute] as string | number) = value;
      isChanged = true;
    }
  };

  const handleListEdit =
    (key: 'styles' | 'colors' | 'tags', map: Map<string, { image: string; name: string }>) =>
    () => {
      const entries = Array.from(map.entries());
      const selected = current[key] as string[];

      const onSubmit = (newSelected: string[]) => {
        if (current[key].join('') !== newSelected.join('')) {
          current[key] = newSelected;
          isChanged = true;
        }
      };

      openEditorDialog(key, entries, selected, onSubmit);
    };

  const handleChangesSave = async () => {
    if (!current.original) return toastError($t('admin.errors.selectOriginal'));
    if (!current.colors.length) return toastError($t('admin.errors.selectColor'));
    if (!current.styles.length) return toastError($t('admin.errors.selectStyle'));
    if (!current.tags.length) return toastError($t('admin.errors.selectTag'));

    try {
      isLoading = true;

      if (isUploading) {
        await handlePost(current);
        toastSuccess($t('admin.success.uploaded'));
      } else {
        await handlePatch(getChanges(model, current));
        toastSuccess($t('admin.success.changesSaved'));
      }

      isChanged = false;
    } catch (error) {
      report('editor', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };

  const initiateDeletion = () => {
    isDeleteInitiated = !isDeleteInitiated;

    if (isDeleteInitiated) {
      setTimeout(() => {
        isDeleteInitiated = false;
      }, 7000);
    }
  };

  const triggerDeletion = async () => {
    try {
      isLoading = true;
      await handleDelete();
      log('editor', `Portraits deleted: ${selectedImages}`, current);
      toastSuccess($t('admin.success.deleted'));
    } catch (err) {
      report('editor', err, current);
      toastError(err);
    } finally {
      isLoading = false;
      isDeleteInitiated = false;
    }
  };

  const updateImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.set('image', file);

      const result = await sendFormData<IPortrait>(
        `/api/portraits/${current.id}/image`,
        formData,
        'PATCH'
      );

      model.image = result.image;
      image = `${PORTRAITS_IMAGE_PATH}/${current.id}/${result.image}`;
      toastSuccess($t('admin.success.converted'));
    } catch (err) {
      report('editor', err, current);
      toastError(err);
    }
  };

  const convertImage = async () => {
    try {
      const imageFile = await convertImageUrl(image);
      updateImage(imageFile);
    } catch (err) {
      report('editor', err, current);
      toastError(err);
    }
  };

  const handlePortraitChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = async () => {
      const imageFile = await convertFile(file);
      await updateImage(imageFile);
      handleClearSelection();
    };

    reader.readAsDataURL(file);
  };
</script>

<section class="editor">
  <header>
    <img src={image} alt="preview" class:multiple={selectedImages > 1} />
    <svg class="selectedImages">
      <text x="33%" y="80%">{selectedImages > 1 ? selectedImages : ''}</text>
    </svg>
  </header>

  <main class="editor">
    <div class="element">
      <div>{$t('admin.editor.original')}:</div>
      <div class="grid column2">
        {#key originalName}
          <div class="flex">
            <a href={originalImage} target="_blank">
              <img src={originalImage} alt="original" />
            </a>
            <Label maxWidth="125px" label={{ name: originalName }} type="originals" />
          </div>
        {/key}
        <EditButton onClick={handleOriginalChange} />
      </div>
    </div>

    <div class="element">
      <div>{$t('admin.editor.quality')}:</div>
      <QualityInput quality={current.quality} onChange={handleValueChange('quality')} />
    </div>

    {#if !isUploading}
      <div class="element baseline">
        <div>{$t('admin.editor.characters')}:</div>
        <div class="character">
          {#if !characters.length}
            {#each current.characters as characterId (characterId)}
              <div class="loadingPlaceholder">...</div>
            {/each}
          {/if}

          {#each characters as character (`${character.id}-${character.updated}`)}
            <EditButton
              onClick={handleCharacterClick(character)}
              label={deriveCharacterLabel(character)}
              icon="✏️"
              isLower={false}
            />
          {/each}
          <EditButton
            onClick={handleCharacterClick(null)}
            label="common.controls.create"
            icon="🆕"
          />
          <EditButton onClick={handleSelectCharacterClick} label="common.controls.select" />
        </div>
      </div>
    {/if}

    <div class="element baseline">
      <div>{$t('admin.editor.colors')}:</div>
      <div class="chipsContainer">
        {#each current.colors as colorName (colorName)}
          <Chip
            chip={colors.get(colorName)}
            type="colors"
            handleRemove={handleRemove('colors', colorName)}
          />
        {/each}
        <EditButton onClick={handleListEdit('colors', colors)} />
      </div>
    </div>

    <div class="element baseline">
      <div>{$t('admin.editor.tags')}:</div>
      <div class="chipsContainer">
        {#each current.tags as tagId (tagId)}
          <Chip chip={tags.get(tagId)} type="tags" handleRemove={handleRemove('tags', tagId)} />
        {/each}
        <EditButton onClick={handleListEdit('tags', tags)} />
      </div>
    </div>

    <div class="element baseline">
      <div>{$t('admin.editor.styles')}:</div>
      <div class="chipsContainer">
        {#each current.styles as styleId (styleId)}
          <Chip
            chip={styles.get(styleId)}
            type="styles"
            handleRemove={handleRemove('styles', styleId)}
          />
        {/each}
        <EditButton onClick={handleListEdit('styles', styles)} />
      </div>
    </div>

    {#if !isUploading}
      <div class="controls">
        {#if isConvertable}
          <button on:click={convertImage}>
            {$t('admin.editor.convertImage')}
          </button>
        {/if}

        <button on:click={() => document.getElementById('uploadPortraitInput')?.click()}>
          {$t('admin.editor.changePortrait')}
        </button>

        <input
          on:change={handlePortraitChange}
          hidden
          id="uploadPortraitInput"
          type="file"
          accept="image/webp, image/jpg, image/jpeg, image/png"
        />

        <button on:click={initiateDeletion}>
          {isDeleteInitiated ? $t('common.controls.cancel') : $t('common.controls.delete')}
        </button>

        <button
          on:click={triggerDeletion}
          style={`visibility: ${isDeleteInitiated ? 'visible' : 'hidden'};`}
        >
          {$t('common.controls.confirmDeletion', { variable: selectedImages })}
        </button>
      </div>
    {/if}
  </main>

  <footer>
    <BasicButton onClick={handleClearSelection}>
      {isUploading || isChanged ? $t('common.controls.cancel') : $t('common.controls.clear')}
    </BasicButton>

    <BasicButton onClick={handleChangesSave} disabled={!isChanged || isLoading}>
      {$t('common.controls.save')}
    </BasicButton>
  </footer>
</section>

<style lang="scss">
  @use 'sass:color';
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

      div.element {
        display: grid;
        grid-template-columns: minmax(90px, 1fr) 2fr;
        gap: 4px;
        align-items: center;
        overflow-wrap: anywhere;

        div.character {
          display: grid;
          gap: 2px 4px;
        }

        div.chipsContainer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 4px;
        }

        div.grid {
          display: grid;
          gap: 0.5rem;
          align-items: center;
        }

        div.column2 {
          grid-template-columns: 3fr 2fr;
        }

        div.flex {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          a {
            height: 20px;
            width: 20px;

            img {
              border-radius: 50%;
              height: 20px;
              width: 20px;
            }
          }
        }

        div.loadingPlaceholder {
          height: 21px;
          padding: 1px 4px;
          background: rgb($secondary, 0.6);
          border-radius: 16px;

          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }

      div.baseline {
        align-items: baseline;
      }

      div.controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 8px;
        grid-column-gap: 16px;

        button {
          font-weight: 300;
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          color: rgb($text, 0.9);

          background-color: $primary;
          transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
          cursor: pointer;

          &:hover {
            background-color: color.scale($primary, $lightness: 5%);
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
