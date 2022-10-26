import { browser } from '$app/environment';
import { PORTRAITS_IMAGE_PATH } from '$lib/config';

export function preloadImage({ id, image }: { id: string; image: string }) {
  if (browser) {
    const nextImage = new Image();
    nextImage.fetchPriority = 'low';
    nextImage.src = `${PORTRAITS_IMAGE_PATH}/${id}/${image}`;
  }
}
