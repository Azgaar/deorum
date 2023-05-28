<script lang="ts">
  import Dialog from '$lib/components/dialog/Dialog.svelte';
  import DialogAction from '$lib/components/dialog/DialogAction.svelte';
  import DialogBody from '$lib/components/dialog/DialogBody.svelte';
  import DialogFooter from '$lib/components/dialog/DialogFooter.svelte';
  import DialogHeader from '$lib/components/dialog/DialogHeader.svelte';
  import Checkbox from '$lib/components/inputs/Checkbox.svelte';
  import { colors as allColors } from '$lib/config';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  export let isOpen: boolean;
  export let selected: string[];
  export let onSubmit: (newSelected: string[]) => void;

  const handleCancel = () => {
    isOpen = false;
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const current = Array.from(formData.keys());

    onSubmit(current);
    handleCancel();
  };
</script>

<Dialog {isOpen} onClickOutside={handleCancel}>
  <DialogHeader>
    {$t('common.controls.select')}
    {$t('admin.editor.colors').toLowerCase()}
  </DialogHeader>

  <form on:submit={handleSubmit}>
    <DialogBody>
      <div class="content">
        {#each allColors as color (color)}
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label use:tooltip title={$t(`admin.colors.${color}`)}>
            <div class="colorBox" style="background-color: {color}" />
            <div class="checkbox">
              <Checkbox name={color} checked={selected.includes(color)} />
            </div>
          </label>
        {/each}
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogAction handleClick={handleCancel}>
        {$t('common.controls.cancel')}
      </DialogAction>

      <DialogAction type="submit">
        {$t('common.controls.apply')}
      </DialogAction>
    </DialogFooter>
  </form></Dialog
>

<style lang="scss">
  form {
    width: min(500px, 90vw);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    div.content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
      grid-template-rows: 1fr 1fr;
      grid-gap: 3px;

      label {
        position: relative;
        cursor: pointer;

        .colorBox {
          width: 100%;
          aspect-ratio: 1;

          transition: filter 0.2s ease-in-out;
          filter: brightness(1);

          &:hover {
            filter: brightness(0.95);
          }
        }

        .checkbox {
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
</style>
