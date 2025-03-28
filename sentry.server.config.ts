// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { secondsInDay } from "date-fns/constants";

Sentry.init({
  dsn: "https://57da6eeb902440ba586a6eda3cabfd18@o4508852211875840.ingest.de.sentry.io/4508852215873616",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
