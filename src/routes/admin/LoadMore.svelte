<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import { t } from '$lib/locales/translations';

  export let onClick: VoidFunction;
</script>

<div class="loadMore">
  <BasicButton {onClick}>
    {$t('admin.editor.loadMore')}
  </BasicButton>
</div>

<style lang="scss">
  div.loadMore {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -70px;
  }
</style>
