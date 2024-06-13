<script lang="ts">
  import BasicButton from '$lib/components/buttons/BasicButton.svelte';
  import Subtitle from '$lib/components/logo/Subtitle.svelte';
  import TextLogo from '$lib/components/logo/TextLogo.svelte';
  import { PORTRAITS_IMAGE_PATH } from '$lib/config';
  import { t } from '$lib/locales/translations';

  export let duplicates: { id: string; image: string }[];

  const openDuplicates = () => {
    const duplicateIds = duplicates.map(({ id }) => `id="${id}"`).join(' || ');
    window.open(`/admin/portraits?filter=${duplicateIds}`);
  };

  const getSrc = (id: string, image: string) => `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
</script>

<section>
  <header>
    <TextLogo size={56} />
    <Subtitle size={18}>{$t('admin.menu.duplicatesHint')}</Subtitle>
  </header>

  <BasicButton onClick={openDuplicates}>
    {$t('admin.menu.openDuplicates')}
  </BasicButton>

  <main class="grid">
    {#each duplicates as { id, image } (id)}
      <figure data-id={id}>
        <img loading="lazy" alt={id} src={getSrc(id, image)} />
      </figure>
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
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      overflow-y: auto;

      figure {
        position: relative;
        margin: 0;
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
