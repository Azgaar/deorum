<script lang="ts" context="module">
  import Header from '$lib/components/header/Header.svelte';

  // TODO: add links to header
  const links = [
    { id: 'originals', key: 'admin.editor.originals', to: './originals' },
    { id: 'tags', key: 'admin.editor.tags', to: './tags' },
    { id: 'styles', key: 'admin.editor.styles', to: './styles' },
    { id: 'colors', key: 'admin.editor.colors', to: './colors' },
    { id: 'quality', key: 'admin.editor.quality', to: './quality' },
    { id: 'back', key: 'common.controls.back', to: '/admin/portraits' }
  ];
</script>

<Header />

<main>
  <slot />
</main>
