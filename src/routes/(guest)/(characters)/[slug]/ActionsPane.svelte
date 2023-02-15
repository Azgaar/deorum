<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { clickOutside } from '$lib/events/clickOutside';
  import BiographyEditor from './BiographyEditor.svelte';
  import { exportChar } from './export';

  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

  const editor = {
    portrait: false,
    details: false,
    bio: false,
    show: (type: 'portrait' | 'details' | 'bio') => () => (editor[type] = true)
  };

  const editOptions = {
    show: false,
    open: () => (editOptions.show = true),
    close: () => (editOptions.show = false)
  };

  const exportOptions = {
    show: false,
    open: () => (exportOptions.show = true),
    close: () => (exportOptions.show = false)
  };
</script>

<section class="actionsPane">
  <div>
    <button on:click={editOptions.open}>{$t('common.controls.edit')}</button>

    {#if editOptions.show}
      <div
        class="options"
        use:clickOutside
        on:clickOutside={editOptions.close}
        on:click={editOptions.close}
      >
        <button on:click={editor.show('portrait')}>{$t('common.details.edit.portrait')}</button>
        <button on:click={editor.show('details')}>{$t('common.details.edit.details')}</button>
        <button on:click={editor.show('bio')}>{$t('common.details.edit.bio')}</button>
      </div>
    {/if}
  </div>

  <div>
    <button on:click={exportOptions.open}>{$t('common.details.export.export')}</button>

    {#if exportOptions.show}
      <div
        class="options"
        use:clickOutside
        on:clickOutside={exportOptions.close}
        on:click={exportOptions.close}
      >
        <button on:click={exportChar(item, 'portrait')}
          >{$t('common.details.export.portrait')}</button
        >
        <button on:click={exportChar(item, 'cardImage')}
          >{$t('common.details.export.cardImage')}</button
        >
        <button on:click={exportChar(item, 'text')}>{$t('common.details.export.text')}</button>
        <button on:click={exportChar(item, 'json')}>{$t('common.details.export.json')}</button>
      </div>
    {/if}
  </div>
</section>

{#if editor.bio}
  <BiographyEditor bind:open={editor.bio} bind:item />
{/if}

<style lang="scss">
  @use 'sass:color';

  section.actionsPane {
    display: flex;
    gap: 8px;

    button {
      border: 0;
      background: #fdd8ae;
      padding: 6px 18px;
      border-radius: 2px;
      transition: all 0.2s ease-in-out;
      cursor: pointer;

      &:hover {
        background: #d4a878;
      }
    }

    div {
      position: relative;

      .options {
        position: absolute;
        bottom: 100%;
        padding: 8px;
        width: max-content;

        display: flex;
        flex-direction: column;
        gap: 8px;

        background-color: color.adjust(black, $alpha: -0.7);
        @media ($mobile) {
          background-color: $surface;
        }
      }
    }
  }
</style>
