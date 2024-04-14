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
    position: relative;
    width: fit-content;
    margin: -70px auto 0;
  }
</style>
