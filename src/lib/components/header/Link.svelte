<script lang="ts">
  import { page } from '$app/stores';

  import { t } from '$lib/locales/translations';
  import type { ILink } from '$lib/types/components.types';

  export let link: ILink;
  const { id, key, to, reload, prefetch } = link;
</script>

<a
  href={to}
  class:active={$page.route.id?.includes(id)}
  data-sveltekit-reload={reload ? '' : undefined}
  data-sveltekit-prefetch={prefetch ? '' : undefined}
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

    @media screen and (max-width: 599px) {
      padding: 2px 12px;
    }
  }

  a:hover {
    background: color.adjust($text, $alpha: -0.85);
  }

  a.active {
    background: color.adjust($text, $alpha: -0.95);
  }
</style>
