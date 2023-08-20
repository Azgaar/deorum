<script lang="ts">
  import { page } from '$app/stores';
  import Actions from '$lib/components/actions/Actions.svelte';
  import LikeButton from '$lib/components/characters/LikeButton.svelte';
  import { Role } from '$lib/config';
  import type { IGalleryItem } from '$lib/types/gallery.types';
  import RemoveButton from '../RemoveButton.svelte';
  import AdminEditCharacterButton from './AdminEditCharacterButton.svelte';
  import AdminEditPortraitButton from './AdminEditPortraitButton.svelte';
  import CharacterPicture from './CharacterPicture.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import EditCharacterButton from './EditCharacterButton.svelte';
  import ReportButton from './ReportButton.svelte';

  export let item: IGalleryItem;
</script>

<div class="imageContainer">
  <CharacterPicture {item} />

  <Actions>
    <svelte:fragment slot="top-left">
      {#if $page.data.role === Role.ADMIN}
        <AdminEditCharacterButton {item} />
        <AdminEditPortraitButton {item} />
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="top-right">
      {#if item.creator}
        <RemoveButton {item} />
      {:else}
        <LikeButton {item} />
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="bottom-right">
      <EditCharacterButton bind:item />
      <ReportButton {item} />
      <DownloadButton {item} />
    </svelte:fragment>
  </Actions>
</div>

<style lang="scss">
  @use 'sass:color';

  div.imageContainer {
    overflow: hidden;
    position: relative;
  }
</style>
