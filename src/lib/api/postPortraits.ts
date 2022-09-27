import type { IPortrait } from '$lib/api.types';
import { changeableKeys, type IEditorData, type IUploadedPortrait } from '$lib/editor.types';
import client from './client';

export async function postPortraits(uploaded: IUploadedPortrait[], editorData: IEditorData) {
  const promises = uploaded.map(({ file }) => {
    const formData = createFormData(editorData);
    formData.set('active', 'true');
    formData.set('image', file);
    return client.records.create('portraits', formData, {
      $autoCancel: false
    }) as unknown as Promise<IPortrait>;
  });

  return Promise.all(promises);
}

function createFormData(editorData: IEditorData) {
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
