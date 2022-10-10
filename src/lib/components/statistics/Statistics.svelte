<script lang="ts">
  import Dialog, { Actions } from '@smui/dialog';
  import Button from '@smui/button';

  import { t } from '$lib/locales/translations';
  import { getOriginalsStatistics } from '$lib/api/getStatistics';
  import { ORIGINALS_IMAGE_PATH } from '$lib/config';

  export let open: boolean;

  const types = ['originals', 'colors', 'tags', 'styles'] as const;
  let activeType: string = types[0];

  let entries: any[] = [];

  const handleTypeChange = (type: string) => async () => {
    activeType = type;
    entries = await getOriginalsStatistics();
  };
</script>

<Dialog bind:open aria-labelledby="statistics-dialog" aria-describedby="statistics-dialog">
  <div class="title">{$t('admin.menu.statistics')}</div>

  <div class="types">
    {#each types as type}
      <button class:active={activeType === type} on:click={handleTypeChange(type)}>
        {type}
      </button>
    {/each}
  </div>

  <div class="content">
    {#each entries || [] as { id, name, image, items } (id)}
      <div>
        <img src={`${ORIGINALS_IMAGE_PATH}/${id}/${image}?thumb=100x100`} alt={name} />
        {$t(`admin.originals.${name}`)}
        {items}
      </div>
    {/each}
  </div>

  <Actions>
    <Button style="color: white" on:click={() => (open = false)}>
      {$t('common.controls.close')}
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
  div.title {
    font-size: larger;
    text-align: left;
    font-weight: 500;
    padding: 1.2rem;
  }

  div.types {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0 1rem 0;

    button {
      background: none;
      color: #ffffff;
      border: 0;
      padding: 8px 24px;
      text-transform: uppercase;
      cursor: pointer;
    }

    button:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    button.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
</style>
