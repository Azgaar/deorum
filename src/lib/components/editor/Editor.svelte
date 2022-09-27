<script lang="ts">
  import Button, { Label } from '@smui/button';

  import { getChanges } from '$lib/api/patchPortraits';
  import { colorsMap } from '$lib/config';
  import { toastError, toastSuccess } from '$lib/stores';
  import { normalizeError } from '$lib/utils/errors';
  import type {
    IEditorData,
    TOpenEditorDialog,
    TOpenOriginalsDialog,
    TPatchHandler,
    TPostHandler
  } from '$lib/editor.types';
  import QualityInput from '$lib/components/qualityInput/QualityInput.svelte';
  import client from '$lib/api/client';
  import './_styles.scss';

  export let model: IEditorData;
  $: current = structuredClone(model);

  export let originals: Map<string, { image: string; name: string }>;
  export let tags: Map<string, string>;
  export let styles: Map<string, string>;

  export let openEditorDialog: TOpenEditorDialog;
  export let openOriginalsDialog: TOpenOriginalsDialog;

  export let handleClearSelection: () => void;
  export let isUploading: boolean;
  export let handlePatch: TPatchHandler;
  export let handlePost: TPostHandler;

  let isChanged = false;
  let isLoading = false;

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

  const handleListEdit = (key: 'styles' | 'colors' | 'tags', map: Map<string, string>) => () => {
    const title = 'Select ' + key;
    const entries = Array.from(map.entries());
    const selected = current[key] as string[];

    const onSubmit = (newSelected: string[]) => {
      if (current[key].join('') !== newSelected.join('')) {
        current[key] = newSelected;
        isChanged = true;
      }
    };

    openEditorDialog(title, entries, selected, onSubmit);
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
</script>

<section class="editor">
  <div>
    Original: {originals.get(current.original)?.name}
    <span class="edit" on:click={handleOriginalChange}>⚙️</span>
  </div>

  <div>
    Quality:
    <QualityInput quality={current.quality} onChange={handleQualityChange} />
  </div>

  <div>
    Colors:
    {#each current.colors as color (color)}
      <span class="chip">
        <span on:click={handleRemove('colors', color)} class="action">✕</span>
        {@html colorsMap.get(color)}
      </span>
    {/each}
    <span class="edit" on:click={handleListEdit('colors', colorsMap)}>⚙️</span>
  </div>

  <div>
    Tags:
    {#each current.tags as tagId (tagId)}
      <span class="chip">
        <span on:click={handleRemove('tags', tagId)} class="action">✕</span>
        {tags.get(tagId)}
      </span>
    {/each}
    <span class="edit" on:click={handleListEdit('tags', tags)}>⚙️</span>
  </div>

  <div>
    Styles:
    {#each current.styles as styleId (styleId)}
      <span class="chip">
        <span class="action" on:click={handleRemove('styles', styleId)}>✕</span>
        {styles.get(styleId)}
      </span>
    {/each}
    <span class="edit" on:click={handleListEdit('styles', styles)}>⚙️</span>
  </div>
</section>

<footer class="editorFooter">
  <Button variant="raised" on:click={handleCancel}>
    <Label>{isChanged ? 'Cancel' : 'Clear'}</Label>
  </Button>

  <Button variant="raised" on:click={handleChangesSave} disabled={!isChanged || isLoading}>
    <Label>Save</Label>
  </Button>
</footer>
