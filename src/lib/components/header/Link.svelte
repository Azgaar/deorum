<script lang="ts">
  import { page } from '$app/stores';

  import { t } from '$lib/locales/translations';
  import type { ILink } from '$lib/types/components.types';

  export let link: ILink;
  const { id, key, to, reload = false, prefetch = true, variable } = link;

  $: isActive = $page.route.id?.includes(id);
  $: label = $t(key, { variable });
</script>

<a
  href={to}
  target={to.startsWith('http') ? '_blank' : undefined}
  class:active={isActive}
  data-sveltekit-reload={reload ? '' : undefined}
  data-sveltekit-preload-data={prefetch ? 'hover' : undefined}
>
  {label}
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

  a.active {
    background: color.adjust($text, $alpha: -0.97);
  }

  a:hover {
    background: color.adjust($text, $alpha: -0.85);
  }
</style>
