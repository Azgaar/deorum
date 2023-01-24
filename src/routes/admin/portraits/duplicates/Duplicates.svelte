<script lang="ts">
  import Button, { Label } from '@smui/button';

  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';

  export let duplicates: {
    id: string;
    image: string;
  }[];

  const openDuplicates = () => {
    const duplicateIds = duplicates.map(({ id }) => `id="${id}"`).join(' || ');
    window.open(`/admin/portraits?filter=${duplicateIds}`);
  };
</script>

<section>
  <header>
    <TextLogo size={56} />
    <Subtitle size={18}>{$t('admin.menu.duplicatesHint')}</Subtitle>
  </header>

  <Button variant="raised" on:click={openDuplicates}>
    <Label>{$t('admin.menu.openDuplicates')}</Label>
  </Button>

  <main class="grid">
    {#each duplicates as { id, image } (id)}
      <div class="imageContainer">
        <img loading="lazy" alt={id} src={`${PORTRAITS_IMAGE_PATH}/${id}/${image}`} />
      </div>
    {/each}
  </main>
</section>

<style lang="scss">
  @use 'sass:color';

  section {
    padding: 3em 2em;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .grid {
      overflow: hidden;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));

      height: 100%;
      overflow-y: auto;

      .imageContainer {
        position: relative;
        aspect-ratio: 1;

        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
        }
      }
    }
  }
</style>
