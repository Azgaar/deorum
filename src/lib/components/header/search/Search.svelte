<script lang="ts">
  import { page } from '$app/stores';
  import Search from '$lib/components/icons/Search.svelte';
  import View from '$lib/components/mediaQuery/View.svelte';
  import { t } from '$lib/locales/translations';
  import Button from '../Button.svelte';
  import SearchDialog from './SearchDialog.svelte';

  let isOpen = false;

  const searchablePages = ['/(guest)/(characters)/gallery/[slug]', '/(guest)/(characters)/[slug]'];
  $: isVisible = $page.route.id && searchablePages.includes($page.route.id);
</script>

<div aria-label="Search container">
  {#if isVisible}
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
  {/if}

  <SearchDialog bind:isOpen />
</div>
