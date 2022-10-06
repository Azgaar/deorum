<script lang="ts">
  import Button, { Label } from '@smui/button';
  import structuredClone from '@ungap/structured-clone';

  import { t } from '$lib/locales/translations';
  import { getChanges } from '$lib/api/patchPortraits';
  import { colorsMap } from '$lib/config';
  import { toastError, toastSuccess } from '$lib/stores';
  import { normalizeError } from '$lib/utils/errors';
  import QualityInput from '$lib/components/qualityInput/QualityInput.svelte';
  import client from '$lib/api/client';

  import EditButton from './EditButton.svelte';

  import type {
    IEditorData,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/editor.types';

  export let model: IEditorData;
  $: current = <IEditorData>structuredClone(model);

  export let originals: Map<string, { image: string; name: string }>;
  export let tags: Map<string, { emoji: string; name: string }>;
  export let styles: Map<string, { emoji: string; name: string }>;

  export let openEditorDialog: TOpenEditorDialog;
  export let openOriginalsDialog: TOpenOriginalsDialog;

  export let handleClearSelection: () => void;
  export let isUploading: boolean;
  export let selectedImages: number;
  export let image: string;

  export let handlePatch: TPatchHandler;
  export let handlePost: TPostHandler;

  let isChanged = false;
  let isLoading = false;

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

  const handleQualityChange = (value: number) => {
    if (value !== current.quality) {
      current.quality = value;
      isChanged = true;
    }
  };

  const handleListEdit =
    (key: 'styles' | 'colors' | 'tags', map: Map<string, { emoji: string; name: string }>) =>
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
    client.cancelAllRequests();

    if (!isChanged) {
      handleClearSelection();
      return;
    }

    current = structuredClone(model);
    isChanged = false;
  };

  const handleChangesSave = async () => {
    if (!current.original) return toastError('Select original image');
    if (!current.colors.length) return toastError('Select at least one color');
    if (!current.styles.length) return toastError('Select at least one style');
    if (!current.tags.length) return toastError('Select at least one tag');

    try {
      isLoading = true;

      if (isUploading) {
        await handlePost(current);
        toastSuccess('Successfully uploaded');
      } else {
        await handlePatch(getChanges(model, current));
        toastSuccess('Changes saved');
      }

      isChanged = false;
    } catch (err) {
      console.error(err);
      toastError(normalizeError(err));
    } finally {
      isLoading = false;
    }
  };

  const getLabel = (key: string, data?: { emoji: string; name: string }) => {
    const { emoji, name } = data || {};
    return emoji + ' ' + $t(`admin.${key}.${name}`);
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
      <div class="chipsContainer">
        {$t(`admin.originals.${originalName}`)}
        <EditButton onClick={handleOriginalChange} />
      </div>
    </div>

    <div class="element">
      <div>{$t('admin.editor.quality')}:</div>
      <QualityInput quality={current.quality} onChange={handleQualityChange} />
    </div>

    <div class="element">
      <div>{$t('admin.editor.colors')}:</div>
      <div class="chipsContainer">
        {#each current.colors as color (color)}
          <span class="chip">
            <span on:click={handleRemove('colors', color)} class="action">✕</span>
            {@html getLabel('colors', colorsMap.get(color))}
          </span>
        {/each}
        <EditButton onClick={handleListEdit('colors', colorsMap)} />
      </div>
    </div>

    <div class="element">
      <div>{$t('admin.editor.tags')}:</div>
      <div class="chipsContainer">
        {#each current.tags as tagId (tagId)}
          <span class="chip">
            <span on:click={handleRemove('tags', tagId)} class="action">✕</span>
            {getLabel('tags', tags.get(tagId))}
          </span>
        {/each}
        <EditButton onClick={handleListEdit('tags', tags)} />
      </div>
    </div>

    <div class="element">
      <div>{$t('admin.editor.styles')}:</div>
      <div class="chipsContainer">
        {#each current.styles as styleId (styleId)}
          <span class="chip">
            <span class="action" on:click={handleRemove('styles', styleId)}>✕</span>
            {getLabel('styles', styles.get(styleId))}
          </span>
        {/each}
        <EditButton onClick={handleListEdit('styles', styles)} />
      </div>
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    backdrop-filter: brightness(0.8) sepia(0.8);
    padding: 0.5rem;
    border-radius: 0.5rem;

    height: calc(100% - 20px);

    @media (max-width: 599px) {
      height: auto;
    }

    header {
      position: relative;
      overflow: hidden;

      @media (max-width: 599px) {
        display: none;
      }

      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        aspect-ratio: 1;
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
      display: flex;
      flex-direction: column;
      gap: 1rem;

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

        span.chip {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          padding: 0.1em 0.5em 0.1em 0.2em;
          background: rgba($surface, 0.35);
          border-radius: 16px;
          transition: all 0.2s ease-in-out;

          span.action {
            position: absolute;
            padding: 0em 0.2em;
            margin: 1px 0 0 -1px;
            opacity: 0;
            border-radius: 16px;
            background-color: rgba($surface, 0.5);
          }
        }

        span.chip:hover {
          background: rgba($surface, 0.4);

          span.action {
            opacity: 1;
          }

          span.action:hover {
            background-color: rgba($surface, 0.6);
          }
        }

        span.chip:active {
          background: rgba($surface, 0.4);
        }

        span.action {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
      }

      div.element:has(.chipsContainer) {
        align-items: baseline;
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
