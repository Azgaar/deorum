<script lang="ts">
  import Button, { Label } from '@smui/button';

  import { t } from '$lib/locales/translations';

  export let onClick: () => void;
</script>

<div class="loadMore">
  <Button variant="raised" on:click={onClick}>
    <Label>{$t('common.editor.loadMore')}</Label>
  </Button>
</div>

<style lang="scss">
  .loadMore {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -70px;
  }
</style>
