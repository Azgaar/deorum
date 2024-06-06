import { goto } from '$app/navigation';
import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import type { IGalleryItem } from '$lib/types/gallery.types';
import { capitalize } from '$lib/utils/string';
import domtoimage from 'dom-to-image';

const exportVariants = {
  portrait: exportPortrait,
  cardImage: exportCardImage,
  text: exportText,
  json: exportJson
};

export const exportChar = (item: IGalleryItem, type: keyof typeof exportVariants) => () => {
  exportVariants[type](item);
};

function exportPortrait(item: IGalleryItem) {
  if (!item.image) throw new Error('No image found for character');

  fetch(`${PORTRAITS_IMAGE_PATH}/${item.image}`)
    .then((response) => response.blob())
    .then((blob) => {
      const dataUrl = window.URL.createObjectURL(blob);
      downloadFile(dataUrl, `${item.name} - Deorum character ${item.id}.png`);
    });
}

async function exportCardImage(item: IGalleryItem) {
  let node = document.getElementById('characterCard');
  if (!node) {
    await goto(`${item.creator ? '/custom' : ''}/${item.id}`);
    node = document.getElementById('characterCard');
  }
  if (!node) throw new Error('Could not find character card node');

  document.body.classList.add('noprint');

  const scale = 4;
  const { offsetWidth, offsetHeight } = node;
  const dx = (offsetWidth * (scale - 1)) / 2 / scale;
  const dy = (offsetHeight * (scale - 1)) / 2 / scale;

  domtoimage
    .toJpeg(node, {
      quality: 0.5,
      height: node.offsetHeight * scale,
      style: { transform: `scale(${scale}) translate(${dx}px, ${dy}px)` },
      width: node.offsetWidth * scale
    })
    .then((dataUrl) => {
      downloadFile(dataUrl, `${item.name} - Deorum character ${item.id}.jpeg`);
      document.body.classList.remove('noprint');
    });
}

function exportText(item: IGalleryItem) {
  let data = `Source: ${window.location.href}\n\n`;

  const keys = [
    'name',
    'race',
    'gender',
    'archetype',
    'background',
    'age',
    'weight',
    'height'
  ] as const;
  data += keys
    .map((key) => {
      const value = item[key];
      return `${capitalize(key)}: ${typeof value === 'string' ? capitalize(value) : value}`;
    })
    .join('\n');

  data += `\n\n${item.bio}`;

  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`;
  downloadFile(dataStr, `${item.name} - Deorum character ${item.id}.txt`);
}

function exportJson(item: IGalleryItem) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { likes, creator, ...exportable } = item;
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportable))}`;
  downloadFile(dataStr, `${item.name} - Deorum character ${item.id}.json`);
}

function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
