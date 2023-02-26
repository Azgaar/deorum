<script lang="ts">
  import Dialog, { Title } from '@smui/dialog';

  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import NumberInput from '$lib/components/inputs/NumberInput.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import { t } from '$lib/locales/translations';
  import { makePOJO } from '$lib/utils/object';

  import type { ICharacter, IRace } from '$lib/types/api.types';
  import { getRange } from '$lib/components/editor/characterDialog/range';
  import { createRandomizer } from '$lib/components/editor/characterDialog/randomize';
  import { createOptions } from '$lib/components/editor/characterDialog/options';
  import IconButton from '$lib/components/editor/IconButton.svelte';
  import BiographyEditor from '$lib/components/editor/characterDialog/biography/BiographyEditor.svelte';

  export let open: boolean;
  export let character: ICharacter;

  export let races: Map<string, IRace>;
  export let archetypes: Map<string, { name: string }>;
  export let backgrounds: Map<string, { name: string }>;
  export let tags: Map<string, { name: string; image: string }>;

  let current = makePOJO(character);
  $: range = getRange(current.gender, current.race, races);
  $: randomize = createRandomizer(current, (updated: ICharacter) => (current = updated), races);

  const options = createOptions(races, archetypes, backgrounds);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    character = current;
    open = false;
  };

  const handleCancel = () => {
    open = false;
  };
</script>

<Dialog
  bind:open
  class="dialog"
  aria-labelledby="character-editor"
  aria-describedby="character-editor"
  scrimClickAction=""
>
  <Title>
    {$t('common.details.editor.title')}
  </Title>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      <div class="columns">
        <div class="column">
          <div class="element">
            <div>{$t('common.character.gender')}:</div>
            <Select bind:value={current.gender} options={options.gender} />
          </div>

          <div class="element">
            <div>{$t('common.character.race')}:</div>
            <Select bind:value={current.race} options={options.race} />
          </div>

          <div class="element">
            <div>{$t('common.character.archetype')}:</div>
            <Select bind:value={current.archetype} options={options.archetype} />
          </div>

          <div class="element">
            <div>{$t('common.character.background')}:</div>
            <Select bind:value={current.background} options={options.background} />
          </div>
        </div>

        <div class="column">
          <div class="element">
            <div>{$t('common.character.name')}:</div>
            <div>
              <TextInput bind:value={current.name} />
              <IconButton onClick={randomize.name}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.age')}:</div>
            <div>
              <NumberInput bind:value={current.age} />
              <span class="extent">{range?.age}</span>
              <IconButton onClick={randomize.age}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.height')}:</div>
            <div>
              <NumberInput bind:value={current.height} />
              <span class="extent">{range?.height}</span>
              <IconButton onClick={randomize.height}>🎲</IconButton>
            </div>
          </div>

          <div class="element">
            <div>{$t('common.character.weight')}:</div>
            <div>
              <NumberInput bind:value={current.weight} />
              <span class="extent">{range?.weight}</span>
              <IconButton onClick={randomize.weight}>🎲</IconButton>
            </div>
          </div>
        </div>
      </div>

      {#key current.id}
        <BiographyEditor bind:character={current} {tags} />
      {/key}
    </div>

    <div class="actions">
      <BasicButton variant="text" onClick={handleCancel}>
        {$t('common.controls.cancel')}
      </BasicButton>

      <BasicButton type="submit" variant="text">
        {$t('common.controls.apply')}
      </BasicButton>
    </div>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;

    div.content {
      display: flex;
      flex-direction: column;
      gap: 12px;

      div.columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        div.column {
          display: flex;
          flex-direction: column;
          gap: 6px;

          div.element {
            display: grid;
            grid-template-columns: 1fr 2fr;
            align-items: center;
            gap: 4px;

            div {
              display: flex;
              align-items: center;
              gap: 2px;
            }

            span.extent {
              font-size: small;
              white-space: nowrap;
            }
          }
        }
      }
    }

    div.actions {
      padding: 12px 0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }
</style>
