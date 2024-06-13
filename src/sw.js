import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

const DAY = 24 * 60 * 60;

const getPolitics = ({ entries, days }) => {
  return [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxEntries: entries, maxAgeSeconds: days * DAY })
  ];
};

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'deorum-html',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })]
  })
);

registerRoute(
  ({ request }) => request.destination === 'script',
  new CacheFirst({
    cacheName: 'deorum-scripts',
    plugins: getPolitics({ entries: 100, days: 10 })
  })
);

registerRoute(
  ({ request }) => request.destination === 'style',
  new CacheFirst({
    cacheName: 'deorum-stylesheets',
    plugins: getPolitics({ entries: 100, days: 10 })
  })
);

registerRoute(
  ({ request }) => request.destination === 'script',
  new CacheFirst({
    cacheName: 'deorum-libs',
    plugins: getPolitics({ entries: 100, days: 30 })
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'deorum-images',
    plugins: getPolitics({ entries: 10000, days: 60 })
  })
);

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'deorum-fonts',
    plugins: getPolitics({ entries: 20, days: 1000 })
  })
);

const immutable = [
  '/api/races',
  '/api/archetypes',
  '/api/backgrounds',
  '/api/tags',
  '/api/originals',
  '/api/styles',
  '/api/colors',
  '/api/quality'
];

registerRoute(
  ({ url }) => immutable.some((path) => url.pathname.startsWith(path)),
  new CacheFirst({
    cacheName: 'deorum-json-immutable',
    plugins: getPolitics({ entries: 20, days: 30 })
  })
);
