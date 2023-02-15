<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { clickOutside } from '$lib/events/clickOutside';
  import { exportChar } from './export';

  import type { IGalleryItem } from '$lib/types/gallery.types';

  export let item: IGalleryItem;

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
        <button on:click={exportChar(item, 'portrait')}>{$t('common.edit.portrait')}</button>
        <button on:click={exportChar(item, 'cardImage')}>{$t('common.edit.details')}</button>
        <button on:click={exportChar(item, 'text')}>{$t('common.edit.bio')}</button>
      </div>
    {/if}
  </div>

  <div>
    <button on:click={exportOptions.open}>{$t('common.export.export')}</button>

    {#if exportOptions.show}
      <div
        class="options"
        use:clickOutside
        on:clickOutside={exportOptions.close}
        on:click={exportOptions.close}
      >
        <button on:click={exportChar(item, 'portrait')}>{$t('common.export.portrait')}</button>
        <button on:click={exportChar(item, 'cardImage')}>{$t('common.export.cardImage')}</button>
        <button on:click={exportChar(item, 'text')}>{$t('common.export.text')}</button>
        <button on:click={exportChar(item, 'json')}>{$t('common.export.json')}</button>
      </div>
    {/if}
  </div>
</section>

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
