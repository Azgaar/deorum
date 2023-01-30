import { convertableMimeTypes, defaultFileName } from '$lib/config';

export const convertImageFile = async (file: File) => {
  if (!convertableMimeTypes.includes(file.type)) return file;

  const arrayBuffer = await fileToArrayBuffer(file);
  const output = await fetch('/api/images/convert', {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: arrayBuffer
  }).then((res) => res.arrayBuffer());

  const blob = new Blob([output], { type: 'image/webp' });
  return new File([blob], `${defaultFileName}.webp`, { type: 'image/webp' });
};

export const convertImageUrl = async (src: string) => {
  const type = `image/${src.split('.')?.pop()}`;
  const arrayBuffer = await fetch(src).then((res) => res.arrayBuffer());

  if (!convertableMimeTypes.includes(type)) {
    const oldFilename = src.split('/').pop() as string;
    return new File([arrayBuffer], oldFilename, { type });
  }

  const output = await fetch('/api/images/convert', {
    method: 'POST',
    headers: { 'Content-Type': type },
    body: arrayBuffer
  }).then((res) => res.arrayBuffer());

  const blob = new Blob([output], { type: 'image/webp' });
  return new File([blob], `${defaultFileName}.webp`, { type: 'image/webp' });
};

export const isConvertableFormat = (src: string) => {
  const type = `image/${src.split('.')?.pop()}`;
  return convertableMimeTypes.includes(type);
};

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
