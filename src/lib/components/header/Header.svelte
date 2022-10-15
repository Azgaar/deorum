<script lang="ts">
  import { page } from '$app/stores';

  import { t } from '$lib/locales/translations';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';

  export let links: { id: string; key: string; to: string }[] = [];
</script>

<header>
  <TextLogo size={42} />

  <nav>
    <ul>
      {#each links as { id, key, to } (key)}
        <li><a href={to} class:active={$page.routeId?.includes(id)}>{$t(key)}</a></li>
      {/each}
    </ul>
  </nav>
</header>

<style lang="scss">
  @use 'sass:color';

  header {
    height: 65px;
    background-color: color.adjust(black, $alpha: -0.8);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;

    @media screen and (max-width: 599px) {
      padding: 0 8px;
      font-size: small;
    }

    ul {
      padding: 0;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;

      li {
        list-style: none;
        text-align: center;

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
      }
    }
  }
</style>
