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

import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { resolve, basename } from 'path';

dotenv.config();

export default defineConfig(({ command }) => {
    // __dirname is /Users/wfrench/git/js-api-samples/samples/
    const projectRepoRoot = resolve(__dirname, '..'); // /Users/wfrench/git/js-api-samples/

    let effectiveOutDir;
    let effectiveBuildInput = {}; // For rollupOptions.input

    if (command === 'build') {
        // When `npm run build:vite --workspace=.` is run from a sample's directory,
        // process.cwd() will be the path to that sample's directory.
        const workspaceDir = process.cwd(); // e.g., /Users/wfrench/git/js-api-samples/samples/test-example
        const samplesBaseDir = resolve(projectRepoRoot, 'samples');

        // Ensure we are building a specific sample within the 'samples' directory
        if (workspaceDir.startsWith(samplesBaseDir) && workspaceDir !== samplesBaseDir) {
            const workspaceName = basename(workspaceDir); // e.g., "test-example"
            // Output to project_root/dist/samples/workspace_name/dist/
            // This path must be relative to Vite's `root` option.
            effectiveOutDir = resolve(projectRepoRoot, 'dist', 'samples', workspaceName, 'dist');
            // Vite's `root` is projectRepoRoot, so input path is relative to that.
            effectiveBuildInput[resolve(workspaceDir, 'index.html')] = resolve(workspaceDir, 'index.html');
        } else {
            // Fallback for builds not initiated from a specific workspace.
            // This shouldn't happen with your current per-sample build scripts.
            console.warn(`Vite build initiated from unexpected directory: ${workspaceDir}. Defaulting output to root of dist.`);
            effectiveOutDir = resolve(projectRepoRoot, 'dist');
        }
    }

    return {
    root: projectRepoRoot, // Vite's project root is js-api-samples/
    build: {
        emptyOutDir: false, // Crucial: Do not empty the main dist dir for each sample.
        outDir: effectiveOutDir || resolve(projectRepoRoot, 'dist'), // Default for serve/preview
        rollupOptions: command === 'build' && Object.keys(effectiveBuildInput).length > 0 ? { input: effectiveBuildInput } : undefined,
    },
    preview: {
        port: 8080,
    },
    
    define: {
        'import.meta.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)
    }
  };
});
