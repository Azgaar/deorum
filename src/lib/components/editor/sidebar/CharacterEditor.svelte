<script lang="ts">
  import MuiButton, { Label as MuiLabel } from '@smui/button';

  import { getChanges } from '$lib/api/patchPortraits';
  import Label from '$lib/components/label/Label.svelte';
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import { t } from '$lib/locales/translations';
  import { toastError, toastSuccess } from '$lib/stores';
  import { log, report } from '$lib/utils/log';
  import { makePOJO } from '$lib/utils/object';

  import EditButton from '../EditButton.svelte';

  import type {
    TChangeableKey,
    TDeleteHandler,
    TPatchCharacterHandler
  } from '$lib/types/editor.types';
  import type { ICharacter } from '$lib/types/api.types';

  export let model: ICharacter;
  $: current = makePOJO(model);

  // export let portraits: Map<string, { image: string; name: string }>;
  export let races: { id: string; name: string }[];
  export let archetypes: { id: string; name: string }[];
  export let backgrounds: { id: string; name: string }[];

  export let handleClearSelection: () => void;
  export let selectedImages: number;
  export let image: string;

  export let handlePatch: TPatchCharacterHandler;
  export let handleDelete: TDeleteHandler;

  let isChanged = false;
  let isLoading = false;
  let isDeleteInitiated = false;

  $: race = races.find(({ id }) => current.race === id)?.name;
  $: archetype = archetypes.find(({ id }) => current.archetype === id)?.name;
  $: background = backgrounds.find(({ id }) => current.background === id)?.name;

  $: console.log(race, archetype, background);

  const handleValueChange = (attribute: TChangeableKey) => (value: number | string) => {
    if (value !== current[attribute]) {
      (current[attribute] as string | number) = value;
      isChanged = true;
    }
  };

  const handleChangesSave = async () => {
    if (!current.race) return toastError($t('admin.errors.selectRace'));

    try {
      isLoading = true;
      await handlePatch(current);
      toastSuccess($t('admin.success.changesSaved'));
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
      <div>{$t('admin.statistics.portraits')}:</div>
      <div class="grid column2" />
    </div>

    <div class="element">
      <div>{$t('common.character.race')}:</div>
      <div class="grid column2">
        {#key race}
          <Label maxWidth="125px" label={{ name: race }} module="common" type="races" />
        {/key}
        <EditButton onClick={() => {}} />
      </div>
    </div>

    <div class="element">
      <div>{$t('common.character.archetype')}:</div>
      <div class="grid column2">
        {#key archetype}
          <Label maxWidth="125px" label={{ name: archetype }} module="common" type="archetypes" />
        {/key}
        <EditButton onClick={() => {}} />
      </div>
    </div>

    <div class="element">
      <div>{$t('common.character.background')}:</div>
      <div class="grid column2">
        {#key background}
          <Label maxWidth="125px" label={{ name: background }} module="common" type="backgrounds" />
        {/key}
        <EditButton onClick={() => {}} />
      </div>
    </div>

    <div class="deletionBlock">
      <BasicButton onClick={initiateDeletion}>
        {$t(isDeleteInitiated ? 'common.controls.cancel' : 'common.controls.delete')}
      </BasicButton>

      <BasicButton
        onClick={triggerDeletion}
        style={`visibility: ${isDeleteInitiated ? 'visible' : 'hidden'};`}
      >
        {$t('common.controls.confirm')}
      </BasicButton>
    </div>
  </main>

  <footer>
    <MuiButton variant="raised" on:click={handleClearSelection} style="width: 50%;">
      <MuiLabel>{isChanged ? $t('common.controls.cancel') : $t('common.controls.clear')}</MuiLabel>
    </MuiButton>

    <MuiButton
      variant="raised"
      on:click={handleChangesSave}
      disabled={!isChanged || isLoading}
      style="width: 50%;"
    >
      <MuiLabel>{$t('common.controls.save')}</MuiLabel>
    </MuiButton>
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

        div.loadingPlaceholder {
          height: 21px;
          padding: 1px 4px;
          background: rgba($secondary, 0.5);
          border-radius: 16px;

          display: flex;
          justify-content: flex-start;
          align-items: center;
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
