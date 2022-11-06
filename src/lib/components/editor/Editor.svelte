<script lang="ts">
  import Button, { Label } from '@smui/button';

  import admin from '$lib/api/admin';
  import { getChanges } from '$lib/api/patchPortraits';
  import Chip from '$lib/components/chips/Chip.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import QualityInput from '$lib/components/inputs/QualityInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import { normalizeError } from '$lib/utils/errors';
  import { log, report } from '$lib/utils/log';
  import { makePOJO } from '$lib/utils/object';
  import { request } from '$lib/utils/loading';

  import EditButton from './EditButton.svelte';

  import type {
    TEditorData,
    TDeleteHandler,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/types/editor.types';

  export let model: TEditorData;
  $: current = makePOJO(model);

  export let originals: Map<string, { image: string; name: string }>;
  export let tags: Map<string, { image: string; name: string }>;
  export let styles: Map<string, { image: string; name: string }>;
  export let colors: Map<string, { image: string; name: string }>;

  export let openEditorDialog: TOpenEditorDialog;
  export let openOriginalsDialog: TOpenOriginalsDialog;

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

  const handleValueChange = (attribute: keyof TEditorData) => (value: number | string) => {
    if (value !== current[attribute]) {
      (current[attribute] as string | number) = value;
      isChanged = true;
    }
  };

  const randomizeAge = () => {
    const age = Math.floor(Math.random() * 100);
    current.age = age;
    isChanged = true;
  };

  const randomizeName = async () => {
    const url = `/api/names/ironarachne?quantity=1&race=${current.race}&type=${current.gender}`;
    current.name = await request(url);
    isChanged = true;
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
        log('editor', 'Portrait uploaded', current);
        toastSuccess($t('admin.success.uploaded'));
      } else {
        await handlePatch(getChanges(model, current));
        log('editor', 'Portrait changed', current);
        toastSuccess($t('admin.success.changesSaved'));
      }

      isChanged = false;
    } catch (error) {
      report('editor', error);
      toastError(normalizeError(error));
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
      toastError(normalizeError(err));
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
        {$t(`admin.originals.${originalName}`)}
        <EditButton onClick={handleOriginalChange} />
      </div>
    </div>

    <div class="element">
      <div>{$t('admin.editor.quality')}:</div>
      <QualityInput quality={current.quality} onChange={handleValueChange('quality')} />
    </div>

    <div class="element">
      <div>{$t('common.character.name')}:</div>
      <div class="grid column2">
        <TextInput value={current.name} onChange={handleValueChange('name')} />
        <EditButton onClick={randomizeName} icon="🎲" label="common.controls.random" />
      </div>
    </div>

    <div class="element">
      <div>{$t('common.character.age')}:</div>
      <div class="grid column3">
        <NumberInput value={current.age} onChange={handleValueChange('age')} />
        <span style="font-size: small; white-space: nowrap;">0 – 100</span>
        <EditButton onClick={randomizeAge} icon="🎲" label="common.controls.random" />
      </div>
    </div>

    <div class="element">
      <div>{$t('common.character.gender')}:</div>
      <Select
        value={current.gender}
        options={['', 'male', 'female', 'non-binary']}
        key="common.gender"
        onChange={handleValueChange('gender')}
      />
    </div>

    <div class="element">
      <div>{$t('common.character.race')}:</div>
    </div>

    <div class="element">
      <div>{$t('common.character.archetype')}:</div>
    </div>

    <div class="element">
      <div>{$t('common.character.background')}:</div>
    </div>

    <div class="element">
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

    <div class="element">
      <div>{$t('admin.editor.tags')}:</div>
      <div class="chipsContainer">
        {#each current.tags as tagId (tagId)}
          <Chip chip={tags.get(tagId)} type="tags" handleRemove={handleRemove('tags', tagId)} />
        {/each}
        <EditButton onClick={handleListEdit('tags', tags)} />
      </div>
    </div>

    <div class="element">
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
        <Label>{$t(isDeleteInitiated ? 'common.controls.cancel' : 'common.controls.delete')}</Label>
      </Button>

      <Button
        variant="raised"
        on:click={triggerDeletion}
        style={`visibility: ${isDeleteInitiated ? 'visible' : 'hidden'};`}
      >
        <Label>{$t('common.controls.confirm')}</Label>
      </Button>
    </div>
  </main>

  <footer>
    <Button variant="raised" on:click={handleCancel} style="width: 50%;">
      <Label>{isChanged ? $t('common.controls.cancel') : $t('common.controls.clear')}</Label>
    </Button>

    <Button
      variant="raised"
      on:click={handleChangesSave}
      disabled={!isChanged || isLoading}
      style="width: 50%;"
    >
      <Label>{$t('common.controls.save')}</Label>
    </Button>
  </footer>
</section>

<style lang="scss">
  section.editor {
    overflow: hidden;
    height: calc(100% - 2rem);
    padding: 1rem 2rem;
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

      @media (max-width: 599px) {
        display: none;
      }

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
        grid-template-columns: 1fr 3fr;
        gap: 4px;
        align-items: center;

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

        div.column3 {
          grid-template-columns: 1fr 2fr 2fr;
        }
      }

      div.element:has(.chipsContainer) {
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
