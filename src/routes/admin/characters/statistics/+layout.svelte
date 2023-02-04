<script lang="ts" context="module">
  import Header from '$lib/components/header/Header.svelte';

  const links = [
    { id: 'races', key: 'admin.statistics.races', to: './races' },
    { id: 'genders', key: 'admin.statistics.genders', to: './genders' },
    { id: 'archetypes', key: 'admin.statistics.archetypes', to: './archetypes' },
    { id: 'backgrounds', key: 'admin.statistics.backgrounds', to: './backgrounds' },
    { id: 'cancel', key: 'common.controls.back', to: '/admin/characters' }
  ];
</script>

<Header {links} />

<main>
  <slot />
</main>
