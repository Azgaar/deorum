<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/locales/translations';
  import { tooltip } from '$lib/scripts/tooltip';

  function formatCoins(coins: number) {
    if (coins > 999) return ((coins / 1000) | 0) + 'K';
    return coins | 0;
  }
</script>

<div class="coins" title={$t('common.coins.coinsLeft', { variable: $page.data.coins })} use:tooltip>
  {formatCoins($page.data.coins)}
</div>

<style lang="scss">
  @use 'sass:color';

  .coins {
    position: absolute;
    border-radius: 50%;
    bottom: 2px;

    width: 12px;
    height: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0px 0px 3px 1px #000000;
    font-size: 50%;
    font-weight: bold;
    color: black;
    background: conic-gradient(
      #b68b38 0turn,
      #c79e5c 0.123558turn,
      #b48736 0.186061turn,
      #f1dd6a 0.285026turn,
      #aa7932 0.436076turn,
      #d89d3b 0.57671turn,
      #d99e3d 0.701717turn,
      #cca35d 0.790264turn,
      #d79d39 0.790364turn,
      #ad7d37 0.84235turn,
      #efdb69 0.904854turn,
      #b28634 0.977775turn
    );
  }
</style>
