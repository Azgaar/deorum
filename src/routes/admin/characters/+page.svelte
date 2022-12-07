<script lang="ts">
  import Checkbox from '@smui/checkbox';

  import CharacterEditor from '$lib/components/editor/sidebar/CharacterEditor.svelte';
  import EditorDialog from '$lib/components/editorDialog/EditorDialog.svelte';
  import EditCharacterDialog from '$lib/components/editor/characterDialog/EditCharacterDialog.svelte';
  import Menu from '$lib/components/editor/menu/Menu.svelte';
  import LoadMore from '$lib/components/loadMore/LoadMore.svelte';

  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { request } from '$lib/utils/requests';
  import { toastError } from '$lib/stores';
  import { parseFilters, parseSorting } from '$lib/utils/filters';
  import { report } from '$lib/utils/log';

  import type { ICharacter, IListResult, IPortrait } from '$lib/types/api.types';
  import type { TOpenEditorDialog } from '$lib/types/editor.types';

  const EXPAND = 'portraits';

  export let data: import('./$types').PageData;

  // incoming data: immutable, turn arrays into maps
  const races = new Map(data.races.map((race) => [race.id, race]));
  const archetypes = new Map(data.archetypes.map(({ id, name }) => [id, { name }]));
  const backgrounds = new Map(data.backgrounds.map(({ id, name }) => [id, { name }]));
  const tags = new Map(data.tags.map(({ id, name, image }) => [id, { name, image }]));

  // incoming data: mutable
  let { page, hasMore, filters, sorting } = data;

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

  const handleCheck = (id: string) => (event: CustomEvent<HTMLElement>) => {
    event.stopPropagation();
    selected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
  };

  const handleLoadMore = async () => {
    try {
      const filter = parseFilters(filters);
      const sort = parseSorting(sorting);
      const params = new URLSearchParams({ page: String(page + 1), filter, sort, expand: EXPAND });

      const charactersList = await request<IListResult<ICharacter>>(
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

  let editorDialogData = {
    open: false,
    key: '',
    entries: [] as [string, { image: string; name: string }][],
    selected: [] as string[],
    onSubmit: (_: string[]) => {}
  };

  const openEditorDialog: TOpenEditorDialog = (key, entries, selected, onSubmit) => {
    editorDialogData = { open: true, key, entries, selected, onSubmit };
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

<main>
  <section class="gallery">
    <div class="grid">
      {#each characters as item (item.id)}
        <div class="imageContainer" on:click={handleClick(item.id)}>
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
    </div>

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
      <Menu openFilters={() => {}} />
    {/if}
  </aside>
</main>

<EditCharacterDialog {...editCharacterDialogData} />
<EditorDialog {...editorDialogData} />

<style lang="scss">
  @use 'sass:color';

  $pane-width-min: 360px;
  $pane-width-max: 460px;

  main {
    height: 100vh;
    overflow: hidden;
    user-select: none;

    display: grid;
    grid-template-columns: 3fr minmax($pane-width-min, 1fr);
    grid-template-areas: 'gallery pane';

    section.gallery {
      grid-area: gallery;
      width: 100%;
      overflow: auto;

      div.grid {
        overflow: hidden;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));

        @media (max-width: 1199px) {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        @media (max-width: 899px) {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        @media (max-width: 599px) {
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        }

        .imageContainer {
          position: relative;
          aspect-ratio: 1;

          img {
            position: absolute;
            width: 100%;
            height: 100%;
            transition: filter 0.2s ease-in-out;
          }

          img.selected {
            filter: brightness(0.8);
          }

          div.checkbox {
            position: absolute;
            bottom: 0;
            left: 0;
            transition: all 0.3s ease-in-out;
          }

          div.checkbox.hidden {
            opacity: 0;
          }
        }

        .imageContainer:hover {
          div.checkbox {
            opacity: 1;
          }
        }
      }
    }

    :global(.imageContainer:hover div.mdc-checkbox__background) {
      transition: all 0.3s ease-in-out;
      border-color: color.adjust($text, $alpha: -0.1) !important;
    }

    aside.pane {
      grid-area: pane;
      background-image: url('/images/menu.webp');
      background-size: 100% 100%;
      overflow: hidden;

      display: flex;
      justify-content: center;

      @media (max-width: 599px) {
        display: flex;
        justify-content: center;
        padding: 1rem 2rem;
        width: auto;
      }
    }
  }
</style>
