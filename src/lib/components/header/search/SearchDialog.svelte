<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Sorting from '$lib/components/editor/filters/Sorting.svelte';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
  import { toastError } from '$lib/stores';
  import type { IRace, IArchetype, IBackground } from '$lib/types/api.types';
  import type { ICharacterFilters, ISorting } from '$lib/types/filters.types';
  import { report } from '$lib/utils/log';
  import { request } from '$lib/utils/requests';
  import { onMount } from 'svelte';

  export let isOpen: boolean;

  let sorting: ISorting = { key: 'created', order: 'desc' };
  let filters: ICharacterFilters = {
    name: '',
    bio: '',
    gender: '',
    race: ['byigyk8mmkjh63c', 'ozfm6jtt6c5qesi', 'ok3meeuvsbdsa0h'],
    archetype: [],
    background: [],
    age: [-Infinity, Infinity]
  };

  let isLoading = true;
  let races = new Map<string, IRace>();
  let archetypes = new Map<string, IArchetype>();
  let backgrounds = new Map<string, IBackground>();

  onMount(async () => {
    try {
      isLoading = true;
      const [racesArray, archetypesArray, backgroundsArray] = await Promise.all([
        request<IRace[]>('/api/races'),
        request<IArchetype[]>('/api/archetypes'),
        request<IBackground[]>('/api/backgrounds')
      ]);

      races = new Map(racesArray.map((race) => [race.id, race]));
      archetypes = new Map(archetypesArray.map((archetype) => [archetype.id, archetype]));
      backgrounds = new Map(backgroundsArray.map((back) => [back.id, back]));
    } catch (error) {
      report('search characters', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  });

  const handleCancel = () => {
    isOpen = false;
  };

  const handleApply = (event: SubmitEvent) => {
    event.preventDefault();
    console.log(filters);
    isOpen = false;
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('common.search.dialog.title')}
  </DialogHeader>

  <form name="Search characters" on:submit={handleApply}>
    <DialogBody>
      <div class="parameters">
        <div aria-label="Filter by name" class="item" class:inactive={!filters.name.length}>
          <Sorting key="name" bind:sorting />
          <span>{$t('common.character.name')}:</span>
          <input type="text" bind:value={filters.name} />
          <button type="button" class="edit" on:click={() => {}}>⚙️</button>
        </div>

        <div aria-label="Filter by biography" class="item" class:inactive={!filters.bio.length}>
          <Sorting key="bio" bind:sorting />
          <span>{$t('common.character.bio')}:</span>
          <input type="text" bind:value={filters.bio} />
          <button type="button" class="edit" on:click={() => {}}>⚙️</button>
        </div>

        <div aria-label="Filter by race" class="item" class:inactive={!filters.race.length}>
          <Sorting key="race" bind:sorting />
          <span>{$t('common.character.race')}:</span>
          <div class="selected rounded">
            {#each filters.race as id (id)}
              <img
                alt={id}
                src={races.get(id)?.image}
                use:tooltip
                title={$t(`common.races.${races.get(id)?.name}`)}
              />
            {/each}
          </div>
          <button type="button" class="edit" on:click={() => {}}>⚙️</button>
        </div>

        <div aria-label="Filter by archetype" class="item" class:inactive={!filters.race.length}>
          <Sorting key="archetype" bind:sorting />
          <span>{$t('common.character.archetype')}:</span>
          <div class="selected rounded">
            {#each filters.archetype as id (id)}
              <img
                alt={id}
                src={races.get(id)?.image}
                use:tooltip
                title={$t(`common.archetypes.${races.get(id)?.name}`)}
              />
            {/each}
          </div>
          <button type="button" class="edit" on:click={() => {}}>⚙️</button>
        </div>

        <div aria-label="Filter by background" class="item" class:inactive={!filters.race.length}>
          <Sorting key="background" bind:sorting />
          <span>{$t('common.character.background')}:</span>
          <div class="selected rounded">
            {#each filters.background as id (id)}
              <img
                alt={id}
                src={races.get(id)?.image}
                use:tooltip
                title={$t(`common.backgrounds.${races.get(id)?.name}`)}
              />
            {/each}
          </div>
          <button type="button" class="edit" on:click={() => {}}>⚙️</button>
        </div>
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.search')}
      </DialogAction>
    </DialogFooter>
  </form>
</Dialog>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.parameters {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .item {
        display: grid;
        align-items: center;
        grid-template-columns: auto auto 1fr auto;
        justify-items: end;

        span,
        button {
          transition: all 0.2s ease-in-out;
        }

        &.inactive > span {
          color: #aaa;
        }

        span:first-child {
          flex: 1;
        }

        .selected {
          display: flex;
          flex-wrap: wrap;
          gap: 0 3px;

          img,
          div {
            width: 20px;
            height: 20px;
          }
        }

        .rounded {
          img,
          div {
            border-radius: 50%;
          }
        }

        input {
          background: none;
          border: none;
          border-bottom: 1px solid rgba($text, 0.4);
          outline: none;
          color: $text;

          height: 22px;
          text-indent: 6px;
        }
      }

      .edit {
        background: none;
        border: none;
        cursor: pointer;
      }
    }
  }
</style>
