<script lang="ts">
  import Search from '$lib/components/icons/Search.svelte';
  import View from '$lib/components/mediaQuery/View.svelte';
  import { t } from '$lib/locales/translations';
  import Button from '../Button.svelte';
  import SearchDialog from './SearchDialog.svelte';

  let isOpen = false;
</script>

<div aria-label="Search container">
  <Button onClick={() => (isOpen = true)}>
    <View>
      <div slot="desktop">
        {$t('common.search.search')}
      </div>

      <div slot="mobile">
        <Search width={20} />
      </div>
    </View>
  </Button>

  <SearchDialog bind:isOpen />
</div>
