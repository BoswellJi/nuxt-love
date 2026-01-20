import * as Sentry from '@sentry/nuxt';

Sentry.init({
  dsn: 'https://c568c8aaabca7e2507a96be9c70a25b8@sentry.inf.17usoft.com/334',
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0,
});
