<script lang="ts">
  import ImageList, { Item, ImageAspectContainer, Image } from '@smui/image-list';

  import { URL } from '$lib/config';
  import type { IPortrait } from '$lib/api.types';
  import './styles.scss';

  export let data: {
    portraits: IPortrait[];
    tags: Map<string, string>;
    styles: Map<string, string>;
    originals: Map<string, string>;
    page: number;
  };

  const { portraits, originals } = data;
  let selected: IPortrait[] = [];

  const collectionId = portraits[0]?.['@collectionId'];
  const imagesPath = `${URL}/api/files/${collectionId}`;
</script>

<ImageList class="my-image-list-standard">
  {#each portraits as item (item.id)}
    <Item>
      <ImageAspectContainer>
        <Image
          loading="lazy"
          alt={originals.get(item.original)}
          src={`${imagesPath}/${item.id}/${item.image}`}
        />
      </ImageAspectContainer>
    </Item>
  {/each}
</ImageList>
