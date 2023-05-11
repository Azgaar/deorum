<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';
</script>

<div
  class="coins"
  title={$t('common.userMenu.coinsLeft', { variable: $page.data.coins })}
  use:tooltip
>
  {$page.data.coins}
</div>

<style lang="scss">
  @use 'sass:color';

  .coins {
    position: absolute;
    bottom: 2px;

    width: 4px;
    height: 4px;
    padding: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: #f6e27a;
    box-shadow: 0px 0px 1px 1px #000000;
    color: black;
    font-size: 0.6em;
  }
</style>
