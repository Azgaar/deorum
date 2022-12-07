<script lang="ts" context="module">
  import Header from '$lib/components/header/Header.svelte';

  const links = [
    { id: 'originals', key: 'admin.statistics.races', to: './races' },
    { id: 'originals', key: 'admin.statistics.genders', to: './genders' },
    { id: 'originals', key: 'admin.statistics.archetypes', to: './archetypes' },
    { id: 'originals', key: 'admin.statistics.backgrounds', to: './backgrounds' },
    { id: 'back', key: 'common.controls.back', to: '/admin/characters' }
  ];
</script>

<Header {links} />

<main>
  <slot />
</main>
