/*
 * Copyright 2024 Google LLC 
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

// e2e/samples.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process'; // Import childProcess
import { waitForGoogleMapsToLoad, failOnPageError } from "./utils";

const samplesDir = path.join(__dirname, '..', 'samples');

const sampleFolders = fs.readdirSync(samplesDir).filter((file) => {
  return fs.statSync(path.join(samplesDir, file)).isDirectory();
});

sampleFolders.forEach((sampleFolder) => {
  test(`test ${sampleFolder}`, async ({ page }) => {
    const url = `http://localhost:8080/samples/${sampleFolder}/`;

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
    const viteProcess = childProcess.spawn('npm', ['run', 'preview', '--', '--port=8080'], {
      cwd: path.join(samplesDir, sampleFolder),
      stdio: 'inherit', 
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    // END run the preview

    try {
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');

      // START NEW
      // wait for google.maps to be loaded
      await waitForGoogleMapsToLoad(page);

      // Check whether the map container element is visible.
      //await expect(page.locator('#map')).toBeVisible(); //TODO: Figure out how to get it to see the map element.
      // END NEW

    } finally {
      viteProcess.kill();
    }
  });
});