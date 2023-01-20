import domtoimage from 'dom-to-image';

import { PORTRAITS_IMAGE_PATH } from '$lib/config';
import { downloadFile } from '$lib/utils/file';

import type { IGalleryItem } from '$lib/types/gallery.types';

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
  fetch(`${PORTRAITS_IMAGE_PATH}/${item.image}`)
    .then((response) => response.blob())
    .then((blob) => {
      const dataUrl = window.URL.createObjectURL(blob);
      downloadFile(dataUrl, `${item.name} - Deorum portrait.png`);
    });
}

function exportCardImage(item: IGalleryItem) {
  const node = document.getElementById('characterCard');
  if (!node) throw new Error('Could not find character card node');

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
      downloadFile(dataUrl, `${item.name} - Deorum character.jpeg`);
    });
}

function exportText(item: IGalleryItem) {
  const charData = Object.entries(item)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(charData)}`;
  downloadFile(dataStr, `${item.name} - Deorum character.txt`);
}

function exportJson(item: IGalleryItem) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(item))}`;
  downloadFile(dataStr, `${item.name} - Deorum character.json`);
}
