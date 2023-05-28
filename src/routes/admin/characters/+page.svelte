<script lang="ts">
  import AdminEditorDialog from '$lib/components/characters/editor/admin/AdminEditorDialog.svelte';
  import AdminMenu from '$lib/components/editor/AdminMenu.svelte';
  import GenericDialog from '$lib/components/editor/genericDialog/GenericDialog.svelte';
  import CharacterEditor from '$lib/components/editor/sidebar/CharacterEditor.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';
  import { PORTRAITS_IMAGE_PATH, charactersConfig } from '$lib/config';
  import { toastError } from '$lib/stores';
  import type { ICharacter, IList, IPortrait } from '$lib/types/api.types';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import Checkbox from '@smui/checkbox';
  import type { PageData } from './$types';
  import Grid from '../Grid.svelte';

  export let data: PageData;

  // incoming data: immutable, turn arrays into maps
  const races = new Map(data.races.map((race) => [race.id, race]));
  const archetypes = new Map(data.archetypes.map(({ id, name }) => [id, { name }]));
  const backgrounds = new Map(data.backgrounds.map(({ id, name }) => [id, { name }]));
  const tags = new Map(data.tags.map(({ id, name, image }) => [id, { name, image }]));

  // incoming data: mutable
  let { page, pageSize, hasMore, filters, sorting } = data;

  // reactive data
  let selected: string[] = [];
  $: characters = data.characters || [];
  $: charactersMap = new Map(characters.map((char) => [char.id, char]));
  $: model = getModel(selected);

  const getModel = (selected: string[]) => {
    if (!selected.length) return null;
    return charactersMap.get(selected[0]);
  };

  const handleClick = (id: string) => () => {
    if (selected.includes(id)) {
      selected = selected.filter((item) => item !== id);
      return;
    }

    if (selected.length > 1) {
      selected = [...selected, id];
    } else {
      selected = [id];
    }
  };

  const handleCheck = (id: string) => (event: CustomEvent<HTMLElement> | KeyboardEvent) => {
    event.stopPropagation();
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  };

  const handleLoadMore = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        pageSize: String(pageSize),
        filter: parseFilters(filters),
        sort: parseSorting(sorting),
        expand: charactersConfig.expand
      });

      const charactersList = await request<IList<ICharacter>>(
        `/api/characters?${params.toString()}`
      );

      page += 1;
      hasMore = page < charactersList.totalPages;
      data.characters = [...data.characters, ...charactersList.items];
    } catch (err) {
      report('admin', err, 'load more');
      toastError(err);
    }
  };

  const handleClearSelection = () => {
    selected = [];
  };

  const getMainImage = (item: ICharacter) => {
    const portraits = item['@expand'].portraits as IPortrait[];
    if (!portraits?.length) return '';

    const { id, image } = portraits[0];
    return `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  };

  let genericDialogData = {
    isOpen: false,
    key: '',
    entries: [] as [string, { image: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const openEditorDialog: TOpenEditorDialog = (key, entries, selected, onSubmit) => {
    genericDialogData = { isOpen: true, key, entries, selected, onSubmit };
  };

  let editCharacterDialogData = {
    open: false,
    character: {} as ICharacter,
    onSubmit: (_: ICharacter) => {},
    onDelete: (_: string) => {},
    portraitIds: [] as string[],
    races,
    archetypes,
    backgrounds,
    tags,
    openEditorDialog
  };

  const createEditHandler = (model: ICharacter) => () => {
    const onSubmit = (updateCharacter: ICharacter) => {
      data.characters = data.characters.map((char) =>
        char.id === updateCharacter.id ? updateCharacter : char
      );
      selected = selected;
    };

    const onDelete = (characterId: string) => {
      data.characters = data.characters.filter(({ id }) => id !== characterId);
      selected = [];
    };

    editCharacterDialogData = {
      ...editCharacterDialogData,
      open: true,
      portraitIds: model.portraits,
      character: model,
      onSubmit,
      onDelete
    };
  };
</script>

<section class="gallery">
  <Grid>
    {#each characters as item (item.id)}
      <div class="imageContainer" on:click={handleClick(item.id)} on:keydown={handleCheck(item.id)}>
        {#if item.portraits.length}
          <img
            loading="lazy"
            alt={item.id}
            src={getMainImage(item)}
            class:selected={selected.includes(item.id)}
          />
        {/if}

        <div class="checkbox" class:hidden={!selected.includes(item.id)}>
          <Checkbox
            on:click={handleCheck(item.id)}
            checked={selected.includes(item.id)}
            touch
            ripple={false}
          />
        </div>
      </div>
    {/each}
  </Grid>

  {#if characters.length === 0}
    <div>No characters found, try to change filter criteria</div>
  {/if}

  {#if hasMore}
    <LoadMore onClick={handleLoadMore} />
  {/if}
</section>

<aside class="pane">
  {#if model}
    <div class="paneHeader">
      <CharacterEditor
        {model}
        {races}
        {archetypes}
        {backgrounds}
        {handleClearSelection}
        image={getMainImage(model)}
        selectedImages={selected.length}
        handleEdit={createEditHandler(model)}
      />
    </div>
  {:else}
    <AdminMenu openFilters={() => {}} />
  {/if}
</aside>

{#if editCharacterDialogData.open}
  <AdminEditorDialog {...editCharacterDialogData} bind:isOpen={editCharacterDialogData.open} />
{/if}

<GenericDialog {...genericDialogData} />

<style lang="scss">
  @use 'sass:color';

  section.gallery {
    grid-area: gallery;
    width: 100%;
    overflow: auto;

    .imageContainer {
      position: relative;
      aspect-ratio: 1;

      img {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: filter 0.2s ease-in-out;

        &.selected {
          filter: brightness(0.8);
        }
      }

      div.checkbox {
        position: absolute;
        bottom: 0;
        left: 0;
        transition: all 0.3s ease-in-out;

        &.hidden {
          opacity: 0;
        }
      }

      &:hover {
        div.checkbox {
          opacity: 1;
        }
      }
    }
  }

  aside.pane {
    grid-area: pane;
    background-image: url('/images/menu.webp');
    background-size: 100% 100%;
    overflow: hidden;

    display: flex;
    justify-content: center;

    @media ($mobile) {
      display: flex;
      justify-content: center;
      padding: 1rem 2rem;
      width: auto;
    }
  }
</style>
