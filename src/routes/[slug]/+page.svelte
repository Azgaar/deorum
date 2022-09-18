<script lang="ts">
  import type { IListResult, IPortrait } from './page.types';
  import { URL } from '../../config';

  export let data: { portraits: IListResult<IPortrait>; page: number };

  const { portraits, page } = data;
  const items = portraits.items || [];

  const collectionId = items[0]?.['@collectionId'];
  const imageStore = `${URL}/api/files/${collectionId}`;
</script>

<svelte:head>
  <title>Deorum Admin</title>
</svelte:head>

<h1>Deorum portraits base</h1>

<section>
  {#each items as item}
    <img alt={item.original} id={item.id} src={`${imageStore}/${item.id}/${item.image}`} />
  {/each}
</section>

<span>Pages:</span>
<a href="/{page - 1}">{page - 1}</a>
<span>[{page}]</span>
<a href="/{page + 1}">{page + 1}</a>
