<script lang="ts">
  import { locale, locales } from '$lib/locales/translations';

  const LOCALES: Record<string, string> = {
    ar: 'العربية',
    bn: 'বাংলা',
    cs: 'Čeština',
    de: 'Deutsch',
    el: 'Ελληνικά',
    en: 'English',
    es: 'Español',
    fa: 'فارسی',
    fr: 'Français',
    he: 'עברית',
    hi: 'हिन्दी',
    hu: 'Magyar',
    id: 'Bahasa Indonesia',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    nl: 'Nederlands',
    pl: 'Polski',
    'pt-BR': 'Português (BR)',
    ro: 'Română',
    ru: 'Русский',
    sr: 'Srpski',
    sv: 'Svenska',
    th: 'ภาษาไทย',
    tr: 'Türkçe',
    uk: 'Українська',
    vi: 'Tiếng Việt',
    'zh-CN': '中文'
  };

  const sortedLocales = [...locales].sort((a, b) =>
    (LOCALES[a] ?? a).localeCompare(LOCALES[b] ?? b)
  );

  function switchLang(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }
</script>

<li on:click|stopPropagation on:keydown|stopPropagation>
  <select name="locale" value={$locale} on:change={switchLang}>
    {#each sortedLocales as lang}
      <option value={lang}>{LOCALES[lang] ?? lang}</option>
    {/each}
  </select>
</li>

<style lang="scss">
  li {
    list-style: none;
  }

  select {
    background: rgb(255, 255, 255, 0.05);
    color: $text;
    border-radius: 24px;
    padding: 4px;
    font-size: inherit;
    cursor: pointer;
    appearance: none;
    text-align: center;

    &:hover {
      background: rgb(255, 255, 255, 0.15);
    }

    option {
      background: #251a1d;
      color: $text;
    }
  }
</style>
