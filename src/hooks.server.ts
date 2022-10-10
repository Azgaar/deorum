import { COOKIE_NAME } from '$lib/config';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  const cookie = event.cookies.get(COOKIE_NAME);

  let lang = 'auto';
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      if (parsed?.model?.profile?.lang) lang = parsed.model.profile.lang;
    } catch (err) {
      console.error('Cannot parse cookie', err);
    }
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
};
