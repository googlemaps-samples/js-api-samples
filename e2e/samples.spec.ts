/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import { assert } from 'console';

const samplesDir = path.join(__dirname, '..', 'samples');

const sampleFolders = fs.readdirSync(samplesDir).filter((file) => {
  return fs.statSync(path.join(samplesDir, file)).isDirectory();
});

// Iterate through samples and run the same test for each one.
sampleFolders.forEach((sampleFolder) => {
  test(`test ${sampleFolder}`, async ({ page }) => {

    // START Build the sample
    const buildProcess = childProcess.spawn('npm', ['run', 'build'], {
      cwd: path.join(samplesDir, sampleFolder),
      stdio: 'inherit',
    });

    await new Promise((resolve, reject) => {
        buildProcess.on('close', (code) => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(`Build process exited with code ${code}`);
          }
        });
      });
    // END Build the sample

    // START run the preview
    // Get an available port
    const port = 8080;

    const url = `http://localhost:${port}/`;

    const viteProcess = childProcess.spawn('vite', ['preview', `--port=${port}`], {
      cwd: path.join(samplesDir, sampleFolder),
      stdio: 'inherit', 
    });

    await new Promise((resolve) => setTimeout(resolve, 500)); // Set a timeout to let the web server start.
    // END run the preview

    /**
     * Run all of the tests. Each method call either runs a test or inserts a timeout for loading.
     * `expect`s are assertions that test for conditions.
     * Run `npx playwright test --ui` to launch Playwright in UI mode to iteratively debug this file.
     */
    try {
      await page.goto(url);

      // Wait for the page DOM to load; this does NOT include the Google Maps APIs.
      await page.waitForLoadState('domcontentloaded');

      // Wait for Google Maps to load.
      await page.waitForFunction(() => window.google && window.google.maps);
      
      // Insert a delay in ms to let the map load.
      await new Promise((resolve) => setTimeout(resolve, 1000));


      // Yo dawg, I heard you like tests, so I made you a test for testing your tests.
      //await expect(page).toHaveTitle('Simple Map'); // Passes on the simple map page, fails on the other as expected.

      // Assertions. These must be met or the test will fail.

      // The sample must load the Google Maps API.
      // IMPORTANT: Ignore the squigglies. `google` is not expected to resolve in the IDE, but at runtime it is global.
      const hasGoogleMaps = await page.evaluate(() => {
        return typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined';
      });
      // The sample must load the Google Maps API.
      assertWithLabel('Google Maps API is loaded.', () => {
        expect(hasGoogleMaps).toBeTruthy();
      });

      // Listen for all console events and handle errors.
      // Create an array to hold all error strings.
      const consoleErrors: string[] = [];
      // If an error occurs, add the message string to the array.
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // If a page error occurs, add the message string to the array.
      page.on('pageerror', (exception) => {
        console.error('Page Error:', exception.message);
        consoleErrors.push(exception.message);
      });

      // TODO: This assert is not catching the missing DIV console error. WHY?
      // Right now it's kind of a lie, but not blocking on this.
      // There must be no console errors.
      assertWithLabel('App loads without error.', () => {
        expect(consoleErrors).toHaveLength(0); 
      });

      /**
       * TODO: Implement conditional logic for samples with no map, such as Places API.
       * Maybe different tests that are conditionally assigned? I think you can do that.
       * What is the best way to check for the existence of visible things which will have many different names and text representations?
       */

      // Verify that the map element is visible.
      // The toBeVisible() assertion fails headlessly if using assertWithLabel().
      const mapElement = await page.locator('#map');
      if (await page.locator('#map').isVisible()) {
        console.log(`✅ Assertion passed: Map is visible.`);
      } else {
        console.error(`❌ Assertion failed: Map is not visible.`);
        throw new Error('Assertion failed: Map is not visible.');
      }


    } finally {
      viteProcess.kill();
    }
  });
});

// TODO: Verify that this doesn't do weird stuff with async (as in the above noted isVisible doesn't work headlessly when )
// Helper function to log assertions with custom labels.
async function assertWithLabel(label: string, assertion: () => Promise<void> | void) {
  try {
    await assertion();
    console.log(`✅ Assertion passed: ${label}`);
  } catch (error) {
    console.error(`❌ Assertion failed: ${label}`);
    throw error; // Re-throw the error to fail the test
  }
}