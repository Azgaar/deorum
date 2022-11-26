import type { IPortrait } from '$lib/types/api.types';
import { changeableKeys, type TEditorData, type IUploadedPortrait } from '$lib/types/editor.types';
import { log } from '$lib/utils/log';
import { sendFormData } from '$lib/utils/requests';
import { pluralize } from '$lib/utils/string';
import { convertImageFile } from './convertImage';

export async function postPortraits(uploaded: IUploadedPortrait[], editorData: TEditorData) {
  const images = await Promise.all(uploaded.map(({ file }) => convertImageFile(file)));

  const promises = images.map((image) => {
    const formData = createFormData(editorData);
    formData.set('active', 'true');
    formData.set('image', image);
    return sendFormData<IPortrait>('/api/portraits', formData, 'POST');
  });

  const results = await Promise.all(promises);
  log(
    'editor',
    `Upload ${pluralize('portrait', results.length)} ${results.map(({ id }) => id).join(', ')}`,
    editorData
  );
  return results;
}

function createFormData(editorData: TEditorData) {
  const formData = new FormData();
  for (const key of changeableKeys) {
    const value = editorData[key];

    if (Array.isArray(value)) {
      value.forEach((element) => formData.append(key, element));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}
