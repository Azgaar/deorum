<script lang="ts">
  import Button, { Label as MuiLabel } from '@smui/button';

  import admin from '$lib/api/admin';
  import { getChanges } from '$lib/api/patchPortraits';
  import Chip from '$lib/components/chips/Chip.svelte';
  import Label from '$lib/components/label/Label.svelte';
  import QualityInput from '$lib/components/inputs/QualityInput.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import { log, report } from '$lib/utils/log';
  import { isSameArray } from '$lib/utils/array';
  import { makePOJO } from '$lib/utils/object';
  import { blankCharacter } from '$lib/data/characters';
  import { deriveCharacterLabel } from '$lib/utils/characters';

  import EditButton from './EditButton.svelte';

  import type {
    TEditorData,
    TDeleteHandler,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler,
    TOpenEditCharacterDialog,
    TChangeableKey,
    TOpenSelectCharacterDialog
  } from '$lib/types/editor.types';
  import type { ICharacter, IRace } from '$lib/types/api.types';
  import { request } from '$lib/utils/requests';

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

  export let handleClearSelection: () => void;
  export let isUploading: boolean;
  export let selectedImages: number;
  export let image: string;

  export let handlePatch: TPatchHandler;
  export let handlePost: TPostHandler;
  export let handleDelete: TDeleteHandler;

  let isChanged = false;
  let isLoading = false;
  let isDeleteInitiated = false;

  $: originalName = originals.get(current.original)?.name;
  let characters: ICharacter[] = [];

  $: console.log(characters);

  const fetchCharacters = async (characterIds: string[]) => {
    if (!characterIds.length || isUploading) {
      characters = [];
      return;
    }

    try {
      const expand = 'race,archetype,background,portraits';
      const promises = characterIds.map((id) =>
        request<ICharacter>(`/api/characters/${id}?expand=${expand}`)
      );
      characters = await Promise.all(promises);
    } catch (error) {
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

    openEditCharacterDialog(characterToEdit || makePOJO(blankCharacter), onSubmit, onDelete);
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

  const handleCancel = () => {
    admin.cancelAllRequests();
    handleClearSelection();
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
      }, 4000);
    }
  };

  const triggerDeletion = async () => {
    try {
      isLoading = true;
      await handleDelete();
      log('editor', 'Portrait deleted', current);
      toastSuccess($t('admin.success.deleted'));
    } catch (err) {
      report('editor', err, current);
      toastError(err);
    } finally {
      isLoading = false;
      isDeleteInitiated = false;
    }
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
        <Label maxWidth="100px" label={{ name: originalName }} type="originals" />
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

    <div class="deletionBlock">
      <Button variant="raised" on:click={initiateDeletion}>
        <MuiLabel
          >{$t(isDeleteInitiated ? 'common.controls.cancel' : 'common.controls.delete')}</MuiLabel
        >
      </Button>

      <Button
        variant="raised"
        on:click={triggerDeletion}
        style={`visibility: ${isDeleteInitiated ? 'visible' : 'hidden'};`}
      >
        <MuiLabel>{$t('common.controls.confirm')}</MuiLabel>
      </Button>
    </div>
  </main>

  <footer>
    <Button variant="raised" on:click={handleCancel} style="width: 50%;">
      <MuiLabel>{isChanged ? $t('common.controls.cancel') : $t('common.controls.clear')}</MuiLabel>
    </Button>

    <Button
      variant="raised"
      on:click={handleChangesSave}
      disabled={!isChanged || isLoading}
      style="width: 50%;"
    >
      <MuiLabel>{$t('common.controls.save')}</MuiLabel>
    </Button>
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
    @media (max-width: 599px) {
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
      }

      div.baseline {
        align-items: baseline;
      }

      div.deletionBlock {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
    }

    footer {
      display: flex;
      flex-grow: 1;
      align-items: flex-end;
      gap: 16px;
      justify-content: space-around;
    }
  }
</style>
