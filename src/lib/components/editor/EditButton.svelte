<script lang="ts">
  import { t } from '$lib/locales/translations';

  export let label: string = 'common.controls.select';
  export let icon: string = '⚙️';
  export let onClick: () => void;
</script>

<button type="button" on:click={onClick}>{icon} {$t(label).toLowerCase()}</button>

<style lang="scss">
  button {
    border: none;
    color: $text;
    font-size: 1rem;
    text-align: left;

    cursor: pointer;
    padding: 0.1em 0.3em;
    background: rgba($secondary, 0.5);
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
  }

  button:hover {
    background: rgba($secondary, 0.6);
  }
</style>
