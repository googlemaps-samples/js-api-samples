import { test, expect } from '@playwright/test';
/**
// NOTE: Trying to graft the old js-samples tests in here to see what happens.
import { waitForGoogleMapsToLoad, failOnPageError } from "./utils";
import fs from "fs";

export const BROKEN_APP_SAMPLES = [
  "store-locator", // Distance Matrix Service: You have exceeded your rate-limit for this API.
];

const samples = fs
  .readdirSync("samples", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !BROKEN_APP_SAMPLES.includes(name));

test.describe.parallel("sample applications", () => {
  samples.forEach((sample) => {
    test.describe(sample, () => {
      test(`app loads without error ${sample}`, async ({ page }) => {
        test.slow();
        failOnPageError(page);

        // go to page and fail if errors
        await page.goto(`dist/samples/${sample}/app`, {
          waitUntil: "networkidle",
        });

        if (sample === "programmatic-load-button") {
          await page.locator("button").click();
        }

        // wait for google.maps to be loaded
        await waitForGoogleMapsToLoad(page);
      });
    });
  });
}); */

// Default tests from Playwright:

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});