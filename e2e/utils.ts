import { Page } from "@playwright/test";

// from https://github.com/lit/lit.dev/blob/5d79d1e0989e68f8b5905e5271229ffe4c55265c/packages/lit-dev-tests/src/playwright/util.ts

export async function waitForGoogleMapsToLoad(page: Page) {
  await page.waitForFunction(() => window.google && window.google.maps);
  await page.waitForTimeout(100);
}

export const failOnPageError = (page: Page) => {
  page.on("pageerror", (e) => {
    console.error(e.message);
    process.emit("uncaughtException", e);
  });
};

export const NONDETERMINISTIC_SAMPLES = [
  "move-camera-ease", // camera always moving
  "map-puzzle", // random puzzle placement
  "map-coordinates",
  "deckgl-tripslayer", // always in motion polylines
  "layer-traffic", // traffic changes
  // local context samples don't always show sidebar immediately
  "local-context-basic",
  "local-context-events",
  "local-context-home",
  "local-context-restrictions",
  "local-context-styles",
];

export const SAMPLES_NEEDING_EXTRA_DELAY = [
  "directions-complex", // allow for extra time to calculate and render directions
];