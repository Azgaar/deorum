<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import { t } from '$lib/locales/translations';
  import type { ILink } from '$lib/types/components.types';

  export let link: ILink;
  const { id, key, to, reload, prefetch } = link;

  $: isActive = $page.route.id?.includes(id);
</script>

<a
  href={to}
  class:active={isActive}
  data-sveltekit-reload={reload ? '' : undefined}
  data-sveltekit-preload-data={prefetch ? '' : undefined}
>
  {$t(key)}
</a>

<style lang="scss">
  @use 'sass:color';

  a {
    text-decoration: none;
    color: $text;
    background: none;
    border-radius: 24px;
    transition: all 0.2s ease-in-out;
    padding: 8px 24px;
  }

  a:hover {
    background: color.adjust($text, $alpha: -0.85);
  }

  a.active {
    background: color.adjust($text, $alpha: -0.95);
  }
</style>
