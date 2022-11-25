const convertableImageTypes = ['image/png', 'image/jpeg', 'image/gif'];
const fileName = 'deorum.webp';

export const converImage = async (file: File) => {
  if (!convertableImageTypes.includes(file.type)) return file;

  const arrayBuffer = await fileToArrayBuffer(file);

  const output = await fetch('/api/images/convert', {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: arrayBuffer
  }).then((res) => res.arrayBuffer());

  const blob = new Blob([output], { type: 'image/webp' });
  return new File([blob], fileName, { type: 'image/webp' });
};

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
