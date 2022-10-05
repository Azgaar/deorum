<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let onClick: () => void;
</script>

<span class="chip" on:click={onClick}>⚙️ {$t('common.controls.select').toLowerCase()}</span>

<style lang="scss">
  span {
    cursor: pointer;
    padding: 0.1em 0.3em;
    background: rgba($surface, 0.35);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
  }

  span:hover {
    background: rgba($surface, 0.5);
  }
</style>
