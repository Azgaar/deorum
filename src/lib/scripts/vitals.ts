import { getCLS, getFCP, getFID, getLCP, getTTFB, type Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;
const viteAnalyticsId = import.meta.env.VITE_VERCEL_ANALYTICS_ID;

type TVitalsOptions = { page: string };

function sendToAnalytics(metric: Metric, options: TVitalsOptions) {
  const body = {
    dsn: analyticsId || viteAnalyticsId, // qPgJqYH9LQX5o31Ormk8iWhCxZO
    id: metric.id, // v2-1653884975443-1839479248192
    page: options.page, // /blog/[slug]
    href: location.href, // https://{my-example-app-name-here}/blog/my-test
    event_name: metric.name, // TTFB
    value: metric.value.toString(), // 60.20000000298023
    speed: navigator.connection?.effectiveType || '' // 4g
  };

  const params = new URLSearchParams(body).toString();
  const blob = new Blob([params], { type: 'application/x-www-form-urlencoded' });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true
    });
}

export function webVitals(options: TVitalsOptions) {
  try {
    getFID((metric) => sendToAnalytics(metric, options));
    getTTFB((metric) => sendToAnalytics(metric, options));
    getLCP((metric) => sendToAnalytics(metric, options));
    getCLS((metric) => sendToAnalytics(metric, options));
    getFCP((metric) => sendToAnalytics(metric, options));
  } catch (err) {
    console.error('[Analytics]', err);
  }
}
