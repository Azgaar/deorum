<script lang="ts">
  import Dialog from '@smui/dialog';
  import FormField from '@smui/form-field';
  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';

  import { t } from '$lib/locales/translations';
  import { request } from '$lib/utils/requests';
  import { report } from '$lib/utils/log';
  import { toastError } from '$lib/stores';
  import { deriveCharacterLabel, derivePrimaryImagePath } from '$lib/utils/characters';

  import Select from '$lib/components/inputs/Select.svelte';
  import CircularSpinner from '$lib/components/spinner/CircularSpinner.svelte';

  import type { ICharacter, IRace, IListResult } from '$lib/types/api.types';

  export let open: boolean;
  export let currentIds: string[];
  export let onSubmit: (characters: ICharacter[]) => void;
  export let races: Map<string, IRace>;

  let page = 1;
  let hasMore = false;
  let characters: ICharacter[] = [];
  let isLoading = true;

  let race = '';

  const all = ['', $t('common.values.all')];
  const options = Array.from(races).map(([id, { name }]) => [id, $t(`common.races.${name}`)]);
  const raceOptions = [all].concat(options);

  $: onOpen(open);

  const onOpen = async (open: boolean) => {
    if (!open) return;
    loadCharacters([]);
  };

  const loadCharacters = async (currentCharacters: ICharacter[]) => {
    try {
      isLoading = true;
      const filter = race ? `race="${race}"` : '';
      const expand = 'race,archetype,background,portraits';
      const url = `/api/characters?page=${page}&filter=${filter}&expand=${expand}`;
      const charactersList = await request<IListResult<ICharacter>>(url);

      hasMore = charactersList.totalPages > page;
      characters = [...currentCharacters, ...charactersList.items];
    } catch (error) {
      report('character selector', error);
      toastError(error);
    } finally {
      isLoading = false;
    }
  };

  const handleRaceChange = (newRace: string) => {
    characters = [];
    race = newRace;
    page = 1;
    loadCharacters([]);
  };

  const loadMore = () => {
    page++;
    loadCharacters(characters);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const selected = characters.filter(({ id }) => currentIds.includes(id));
    onSubmit(selected);
    open = false;
  };
</script>

<Dialog
  bind:open
  class="dialog"
  aria-labelledby="select-character"
  aria-describedby="select-character"
>
  <section class="title">
    <div>{$t('common.controls.select')} {$t('admin.editor.characters').toLowerCase()}</div>
    <Select value={race} options={raceOptions} onChange={handleRaceChange} />
  </section>

  <form class="body" on:submit={handleSubmit}>
    <ul class="list">
      {#each characters as character (character.id)}
        <li class="lineItem">
          <FormField>
            <Checkbox bind:group={currentIds} value={character.id} />
            <span slot="label" class="label">
              <img src={derivePrimaryImagePath(character, 100)} alt={character.name} />
              {deriveCharacterLabel(character)}
            </span>
          </FormField>
        </li>
      {/each}
    </ul>

    <div class="actions">
      {#if isLoading}
        <CircularSpinner size={20} />
      {/if}

      {#if hasMore}
        <Button type="button" style="color: white" disabled={isLoading} on:click={loadMore}>
          <Label>{$t('admin.editor.loadMore')}</Label>
        </Button>
      {/if}

      <Button type="button" style="color: white" on:click={() => (open = false)}>
        <Label>{$t('common.controls.close')}</Label>
      </Button>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.apply')}</Label>
      </Button>
    </div>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  section.title {
    padding: 1rem 1.5rem;
    font-size: large;
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
  }

  form.body {
    padding: 0 1.5rem;

    ul.list {
      margin: 0;
      padding: 0;
      height: min(560px, 90vh);
      overflow-y: auto;

      display: flex;
      flex-direction: column;
      gap: 2px;

      span.label {
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-gap: 8px;
        align-items: center;

        img {
          width: 100%;
          aspect-ratio: 1/1;
        }
      }
    }

    div.actions {
      padding: 12px 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }
  }
</style>
