import { test, expect, defineConfig } from '@playwright/test';
import { waitForGoogleMapsToLoad, failOnPageError } from "./utils";
import * as fs from 'fs';

export const BROKEN_APP_SAMPLES = [
  "store-locator", // Distance Matrix Service: You have exceeded your rate-limit for this API.
];

// Function to get a list of sample subfolders
function getSampleFolders() {
  const path = require ('path');
  const samplesDir = path.resolve(__dirname, '../samples');
  const entries = fs.readdirSync(samplesDir, { withFileTypes: true }); 
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

export default defineConfig({
  projects: getSampleFolders().map((sampleFolder) => ({
    name: sampleFolder,
    use: {
      //baseURL: `http://localhost:8080/${sampleFolder}/`,
      //headless: true, 
    },
    webServer: {
      //command: `npm run build --prefix samples/${sampleFolder}/ && cd ../samples/${sampleFolder} && vite preview --port 8080 --base /${sampleFolder}/`,
      //command: `npm run build --prefix ./samples/{sampleFolder}/ && cd ./samples/{sampleFolder}/dist && vite preview --port 8080 --base /${sampleFolder}/`,
      //command: `npm run build --prefix ./samples/${sampleFolder}/ && cd ${process.cwd()}/samples/${sampleFolder}/ && vite preview --port 8080`,
      //command: `npm run build --prefix ./samples/${sampleFolder}/ && VITE_ROOT=${process.cwd()}/samples/${sampleFolder}/dist && vite preview --port 8080 --base /${sampleFolder}/`,

      //command: `npm run build --prefix ../samples/${sampleFolder}/ && cd ../samples/${sampleFolder}/ && vite preview --port 8080 --base /${sampleFolder}/dist/`,
      //url: `http://localhost:8080/${sampleFolder}/`,

      command: `npm run start`,
      reuseExistingServer: !process.env.CI,
    },
  })),

  // ... other configurations ...
});

test(`test add-map`, async ({ page }) => {
  await page.goto(`http://localhost:8080/samples/add-map/`);
  await page.waitForLoadState('domcontentloaded');
});

// Commenting this out for now...
/**
const sampleFolders = getSampleFolders();

// Loop through each sample folder
for (const sampleFolder of sampleFolders) {
  // Check if the current test file belongs to this sample folder
  if (sampleFolder) { 
    test(`test ${sampleFolder}`, async ({ page }) => {
      // Check and log
      const url = `/${sampleFolder}`;
      console.log('Navigating to:', url);

      await page.waitForTimeout(2000);//TODO: Resume troubleshooting.
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');
      // ... your test logic for the current sample ...
    });
  } else {
    console.log(`${sampleFolder} not found`);
  }
} */

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

/**
const samples = fs
  .readdirSync("samples", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !BROKEN_APP_SAMPLES.includes(name));

export default defineConfig({
  webServer: {
    command: `npm run start`,
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
  use: {
    baseURL: "http://localhost:5173",
  },
});

test.describe.parallel("sample applications", () => {
  samples.forEach((sample) => {
    test.describe(sample, () => {
      test(`app loads without error ${sample}`, async ({ page }) => {
        test.slow();
        failOnPageError(page);

        // go to page and fail if errors
        await page.goto(`${sample}/dist`, {
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
});
*/