// e2e/samples.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process'; // Import childProcess

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
      // Add your assertions here
    } finally {
      viteProcess.kill();
    }
  });
});