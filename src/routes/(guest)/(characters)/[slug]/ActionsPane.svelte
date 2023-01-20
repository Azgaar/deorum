<script lang="ts">
  import { t } from '$lib/locales/translations';
  import { clickOutside } from '$lib/events/clickOutside';
  import type { IGalleryItem } from '$lib/types/gallery.types';

  import { exportChar } from './export';

  export let item: IGalleryItem;

  let showExportVariants = false;
  const openExportVariants = () => {
    if (!showExportVariants) showExportVariants = true;
  };
  const closeExportVariants = () => {
    showExportVariants = false;
  };
</script>

<section class="actionsPane">
  <div class="actionButtons">
    <button>{$t('common.controls.edit')}</button>

    <div>
      <button on:click={openExportVariants}>
        {$t('common.export.export')}
      </button>

      {#if showExportVariants}
        <div
          class="exportOptions"
          use:clickOutside
          on:clickOutside={closeExportVariants}
          on:click={closeExportVariants}
        >
          <button on:click={exportChar(item, 'portrait')}>{$t('common.export.portrait')}</button>
          <button on:click={exportChar(item, 'cardImage')}>{$t('common.export.cardImage')}</button>
          <button on:click={exportChar(item, 'text')}>{$t('common.export.text')}</button>
          <button on:click={exportChar(item, 'json')}>{$t('common.export.json')}</button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use 'sass:color';

  section.actionsPane {
    position: fixed;
    left: 0px;
    bottom: 0px;

    width: 100%;
    height: 48px;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    padding: 0 32px;
    align-items: center;

    .actionButtons {
      width: auto;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 8px;

      button {
        color: $text;
        background: none;
        border: 0;
        border-radius: 24px;
        transition: all 0.2s ease-in-out;
        padding: 8px 24px;
        cursor: pointer;
      }

      button:hover {
        background: color.adjust($text, $alpha: -0.85);
      }

      .exportOptions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: absolute;
        bottom: 100%;
        padding: 8px;

        background-color: color.adjust(black, $alpha: -0.7);
        @media ($mobile) {
          background-color: $surface;
        }
      }
    }
  }
</style>
