<script lang="ts">
  import Dialog, { Actions, Title } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';
  import { colors as allColors } from '$lib/config';

  export let open: boolean;
  export let colors: string[];

  let current = [...colors];

  const handleSelect = (color: string) => () => {
    current = current.includes(color) ? current.filter((id) => id !== color) : [...current, color];
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    colors = [...current];
    open = false;
  };
</script>

<Dialog bind:open aria-labelledby="colors-filter" aria-describedby="colors-filter">
  <Title>{$t('common.controls.select')} {$t('admin.editor.colors').toLowerCase()}</Title>

  <form class="body" on:submit={handleSubmit}>
    <div class="content">
      {#each allColors as color (color)}
        <button
          type="button"
          class:selected={current.includes(color)}
          on:click={handleSelect(color)}
          style="background-color: {color};"
        >
          <span class="checkmark" />
        </button>
      {/each}
    </div>

    <Actions>
      <Button type="submit" style="color: white">
        <Label>{$t('common.controls.close')}</Label>
      </Button>
    </Actions>
  </form>
</Dialog>

<style lang="scss">
  @use 'sass:color';

  form.body {
    padding: 0 1.5rem;
    width: min(500px, 90vw);
  }

  div.content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    grid-gap: 3px;

    button {
      aspect-ratio: 1;
      transition: all 0.2s ease-in-out;
      border: 1px solid transparent;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      .checkmark {
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: color.adjust($surface, $alpha: -0.4);
        border-radius: 50%;
        width: 24px;
        height: 24px;

        transition: all 0.2s ease-in-out;
        opacity: 0;
      }

      .checkmark::after {
        content: '✓';
        color: $text;
        font-size: 1.2rem;
      }

      &:hover {
        filter: brightness(0.9);
      }

      &.selected {
        border-color: $text;

        .checkmark {
          opacity: 1;
        }
      }
    }
  }
</style>
