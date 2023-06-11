<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let hasCharacters: boolean | null;

  const options = [
    { value: true, label: $t('common.controls.yes') },
    { value: false, label: $t('common.controls.no') },
    { value: null, label: $t('common.values.all') }
  ];
</script>

<div class="hasCharacters">
  {#each options as option}
    <button
      type="button"
      class:current={hasCharacters === option.value}
      on:click={() => (hasCharacters = option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style lang="scss">
  .hasCharacters {
    display: flex;
    gap: 12px;

    button {
      width: 22px;
      border-radius: 16px;
      padding: 0;

      background: none;
      color: rgb($text, 0.3);
      border: none;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }

    button:hover {
      color: rgb($text, 0.8);
    }

    button.current {
      color: $text;
    }
  }
</style>
