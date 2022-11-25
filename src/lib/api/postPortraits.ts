import type { IPortrait } from '$lib/types/api.types';
import { changeableKeys, type TEditorData, type IUploadedPortrait } from '$lib/types/editor.types';
import { log } from '$lib/utils/log';
import { postForm } from '$lib/utils/requests';
import { pluralize } from '$lib/utils/string';

export async function postPortraits(uploaded: IUploadedPortrait[], editorData: TEditorData) {
  // const promises = uploaded.map(({ src }) => fetch(src).then((res) => res.arrayBuffer()));

  const promises = uploaded.map(({ file }) => {
    const formData = createFormData(editorData);
    formData.set('active', 'true');
    formData.set('image', file);
    return postForm<IPortrait>('/api/portraits', formData);
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
