// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://57da6eeb902440ba586a6eda3cabfd18@o4508852211875840.ingest.de.sentry.io/4508852215873616",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // A good proportion for performance and minimizing costs is 0.1.
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
