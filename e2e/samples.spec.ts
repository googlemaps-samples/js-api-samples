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
import childProcess, { execSync } from 'child_process';

const samplesDir = path.join(__dirname, '..', 'samples');

// Function to return all sample folders.
const getAllSampleFolders = () => {
  return fs.readdirSync(samplesDir).filter((file) => {
    // Ensure we are only looking at directories within samplesDir, excluding find-changes.sh itself if it's a file
    const filePath = path.join(samplesDir, file);
    return fs.statSync(filePath).isDirectory();
  });
};

// Function to return only changed sample folders.
const getChangedSampleFolders = (): string[] => {
  try {
    const scriptPath = path.join(__dirname, '..', 'samples', 'find-changes.sh'); 
    
    if (!fs.existsSync(scriptPath)) {
      console.warn(`Warning: find-changes.sh not found at ${scriptPath}. Running tests for all samples.`);
      return getAllSampleFolders();
    }

    // Execute the script from the project root.
    const projectRoot = path.join(__dirname, '..'); 
    //const output = execSync(`sh ${scriptPath}`, { cwd: projectRoot, encoding: 'utf-8' });
    const baseRefForScript = process.env.GIT_BASE_REF;
    let commandToExecute = `bash ${scriptPath}`; // Use bash to ensure consistency with shebang
    if (baseRefForScript) {
      commandToExecute = `bash ${scriptPath} "${baseRefForScript}"`;
    }
    console.log(`Executing: ${commandToExecute}`);
    const output = execSync(commandToExecute, { cwd: projectRoot, encoding: 'utf-8' });
    
    const outputLines = output.trim().split('\n');
    const changedFolders: string[] = [];
    const markerLine = "Changed (added or modified) subfolders in 'samples/':";
    let foundMarker = false;

    for (const line of outputLines) {
      if (foundMarker) {
        const folderName = line.trim();
        if (folderName.length > 0) {
          changedFolders.push(folderName);
        }
      }
      if (line.trim() === markerLine) {
        foundMarker = true;
      }
    }

    if (!foundMarker || changedFolders.length === 0) {
      console.log("No changed sample folders found. Skipping tests.");
      return [];
    }

    // Validate that changed folders actually exist in samplesDir
    const validChangedFolders = changedFolders.filter(folderName => {
      const folderPath = path.join(samplesDir, folderName);
      return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
    });

    if (validChangedFolders.length === 0) {
      console.warn("Folders were found, but none were valid sample directories. Skipping tests.");
      console.log("Extracted folder names that were considered invalid:", changedFolders);
      console.log("Full output from find-changes.sh for debugging:\n", output);
      return []; // Fallback to do nothing
    }

    console.log("Running tests only for changed samples: ", validChangedFolders);
    return validChangedFolders;

  } catch (error) {
    console.error("Error running find-changes.sh. Skipping tests:", error);
    return []; // Fallback to do nothing
  }
};

// Get changed folders, filtering out excluded ones.
const foldersToTest = getChangedSampleFolders();

if (foldersToTest.length === 0) {
  console.log("No sample folders found.");
} else {
  console.log(`Will run tests for the following folders: ${foldersToTest.join(', ')}`);
}

// Iterate through samples and run the same test for each one.
foldersToTest.forEach((sampleFolder) => {
  test(`test ${sampleFolder}`, async ({ page }) => {

    // START run the preview
    // Get an available port
    const port = 8080;
    const url = `http://localhost:${port}/`;

    const viteProcess = childProcess.spawn('vite', ['preview', `--port=${port}`], {
      cwd: path.join(samplesDir, sampleFolder),
      stdio: 'inherit',
      detached: true, // Allows parent to exit independently, though we kill it in finally
    });

    //await new Promise((resolve) => setTimeout(resolve, 500)); // Set a timeout to let the web server start.
    await page.waitForTimeout(500);
    // END run the preview

    /**
     * Run all of the tests. Each method call either runs a test or inserts a timeout for loading.
     * `expect`s are assertions that test for conditions.
     * Run `npx playwright test --ui` to launch Playwright in UI mode to iteratively debug this file.
     */
    try {
      const consoleErrors: string[] = [];
      // Capture console errors and page errors
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (exception) => {
        consoleErrors.push(exception.message);
      });
      
      // Navigate to the page.
      //await page.goto(url, { waitUntil: 'networkidle', timeout: 500 });
      await page.goto(url);

      // Allow some time for async operations and errors to be caught
      //await page.waitForTimeout(500);

      // Filter out error messages we can safely avoid.
      const filteredErrorMessages = [
        'Falling back to Raster',
        'Attempted to load a 3D Map, but failed.',
        'The map is not a vector map',
        'Property \'importLibrary\' does not exist on type \'Loader\'.'
      ];
      const criticalErrors = consoleErrors.filter(error =>
        !filteredErrorMessages.some(message => error.includes(message))
      );

      if (criticalErrors.length > 0) {
        console.error(`Critical console errors found in ${sampleFolder}:`, criticalErrors);
      }
      expect(criticalErrors).toHaveLength(0);

      // Wait for the page DOM to load; this does NOT include the Google Maps APIs.
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

      // Wait for Google Maps to load.
      await page.waitForFunction(() => window.google && window.google.maps, { timeout: 500 });
      
      // Insert a delay in ms to let the map load.
      await page.waitForTimeout(500);

      // Assertions. These must be met or the test will fail.
      // The sample must load the Google Maps API.
      const hasGoogleMaps = await page.evaluate(() => {
        return typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined';
      });
      await expect(hasGoogleMaps).toBeTruthy();

      /**const mapElement = await page.locator('#map');
      if (await page.locator('#map').isVisible()) {
        console.log(`✅ Assertion passed: Map is visible.`);
      } else {
        console.error(`❌ Assertion failed: Map is not visible.`);
        throw new Error('Assertion failed: Map is not visible.');
      }*/
    } finally {
      //viteProcess.kill(); // We used to just kill the process. Curious to see about how the other stuff works.
      if (viteProcess.pid) {
        try {
          // Use process.kill for cross-platform compatibility, sending SIGINT
          process.kill(viteProcess.pid, 'SIGINT');
        } catch (e) {
          console.warn(`Failed to kill Vite process for ${sampleFolder} (PID: ${viteProcess.pid}):`, e.message);
        }
      }
      // Add a small delay to allow the process to terminate
      await page.waitForTimeout(500);
    }
  });
});
