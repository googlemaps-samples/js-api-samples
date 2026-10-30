/*
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import prettier from 'prettier';

const rawName = process.argv[2];
const modeArgs = process.argv.slice(3);

if (!rawName) {
    console.error(
        'Usage: node generate-snippets.js <sample-name> [--docs] [--jsfiddle]'
    );
    process.exit(1);
}

const sampleName = path.basename(rawName);
if (sampleName !== rawName || sampleName === '.' || sampleName === '..') {
    console.error(`Invalid sample name: ${rawName}`);
    process.exit(1);
}

const scriptDir = import.meta.dirname;
const projectRoot = path.dirname(scriptDir);
const sampleSrcDir = path.resolve(scriptDir, sampleName);
const distSamplesRoot = path.resolve(projectRoot, 'dist', 'samples');
const sampleDistDir = path.resolve(distSamplesRoot, sampleName);

if (
    !sampleSrcDir.startsWith(scriptDir + path.sep) ||
    !sampleDistDir.startsWith(distSamplesRoot + path.sep)
) {
    console.error(`Path traversal detected for sample: ${sampleName}`);
    process.exit(1);
}

const hostedBaseUrl = `https://maps-docs-team.web.app/samples/${sampleName}/dist`;

/**
 * Replaces `new URL('./public/...', import.meta.url)` expressions with hosted asset URLs.
 */
function rewriteJsAssets(content) {
    return content.replace(
        /new URL\(\s*['"`]\.\/public\/([^'"`]+)['"`],\s*import\.meta\.url\s*\)(?:\.href|\.toString\(\))?/g,
        `\`${hostedBaseUrl}/$1\``
    );
}

/**
 * Replaces local relative HTML `src="./..."` asset attributes with hosted asset URLs.
 */
function rewriteHtmlAssets(content) {
    return content
        .replace(/src="\.\/(img|public|icons)\//g, `src="${hostedBaseUrl}/$1/`)
        .replace(
            /src="\.\/([^"]+\.(png|svg|jpg|jpeg|gif|json|geojson))"/g,
            `src="${hostedBaseUrl}/$1"`
        );
}

/**
 * Removes region tags from JS/TS content.
 */
function stripJsRegionTags(content) {
    return content
        .replace(/\/\/ \[(?:START|END) [^\n\r]*\]/g, '')
        .replace(/\/\* \[(?:START|END) [^\n\r]*\] \*\//g, '');
}

/**
 * Removes region tags from HTML content.
 */
function stripHtmlRegionTags(content) {
    return content.replace(/<!--\s*\[(?:START|END) [^\n\r]*\]\s*-->/g, '');
}

/**
 * Removes region tags from CSS content.
 */
function stripCssRegionTags(content) {
    return content.replace(/\/\* \[(?:START|END) maps_[^\n\r]*\] \*\//g, '');
}

/**
 * Removes the `GOOGLE_MAPS_API_KEY` key parameter from HTML content for JSFiddle.
 */
function stripHtmlApiKey(content) {
    return content
        .replace(/^[ \t]*key:\s*"GOOGLE_MAPS_API_KEY",?[ \t]*\r?\n/gm, '')
        .replace(/&key=GOOGLE_MAPS_API_KEY/g, '')
        .replace(/\?key=GOOGLE_MAPS_API_KEY&/g, '?')
        .replace(/\?key=GOOGLE_MAPS_API_KEY/g, '');
}

/**
 * Generates documentation snippet files in `dist/samples/<name>/docs`.
 */
function generateDocs() {
    console.log(`>>>Generating docs snippets for ${sampleName}`);
    const docsDir = path.join(sampleDistDir, 'docs');
    fs.mkdirSync(docsDir, { recursive: true });

    for (const file of ['index.ts', 'index.js']) {
        const srcPath = path.join(sampleSrcDir, file);
        if (fs.existsSync(srcPath)) {
            const content = fs.readFileSync(srcPath, 'utf8');
            fs.writeFileSync(
                path.join(docsDir, file),
                rewriteJsAssets(content)
            );
        }
    }

    const htmlSrcPath = path.join(sampleSrcDir, 'index.html');
    if (fs.existsSync(htmlSrcPath)) {
        const content = fs.readFileSync(htmlSrcPath, 'utf8');
        fs.writeFileSync(
            path.join(docsDir, 'index.html'),
            rewriteHtmlAssets(content)
        );
    }

    const cssSrcPath = path.join(sampleSrcDir, 'style.css');
    if (fs.existsSync(cssSrcPath)) {
        fs.copyFileSync(cssSrcPath, path.join(docsDir, 'style.css'));
    }
}

/**
 * Generates JSFiddle files (`demo.js`, `demo.html`, `demo.css`, `demo.details`)
 * in `dist/samples/<name>/jsfiddle`.
 */
async function generateJsFiddle() {
    console.log(`>>>Generating JSFiddle files for ${sampleName}`);
    const jsfiddleDir = path.join(sampleDistDir, 'jsfiddle');
    fs.mkdirSync(jsfiddleDir, { recursive: true });

    const prettierConfig =
        (await prettier.resolveConfig(
            path.join(projectRoot, '.prettierrc.json')
        )) ?? {};

    const jsSrcPath = path.join(sampleSrcDir, 'index.js');
    if (fs.existsSync(jsSrcPath)) {
        const demoJsPath = path.join(jsfiddleDir, 'demo.js');
        let content = fs.readFileSync(jsSrcPath, 'utf8');
        content = rewriteJsAssets(content);
        content = stripJsRegionTags(content);
        content = await prettier.format(content, {
            ...prettierConfig,
            filepath: demoJsPath,
        });
        fs.writeFileSync(demoJsPath, content);
    }

    const htmlSrcPath = path.join(sampleSrcDir, 'index.html');
    if (fs.existsSync(htmlSrcPath)) {
        const demoHtmlPath = path.join(jsfiddleDir, 'demo.html');
        let content = fs.readFileSync(htmlSrcPath, 'utf8');
        content = rewriteHtmlAssets(content);
        content = stripHtmlRegionTags(content);
        content = stripHtmlApiKey(content);
        content = await prettier.format(content, {
            ...prettierConfig,
            filepath: demoHtmlPath,
        });
        fs.writeFileSync(demoHtmlPath, content);
    }

    const cssSrcPath = path.join(sampleSrcDir, 'style.css');
    if (fs.existsSync(cssSrcPath)) {
        const demoCssPath = path.join(jsfiddleDir, 'demo.css');
        let content = fs.readFileSync(cssSrcPath, 'utf8');
        content = stripCssRegionTags(content);
        content = await prettier.format(content, {
            ...prettierConfig,
            filepath: demoCssPath,
        });
        fs.writeFileSync(demoCssPath, content);
    }

    for (const file of ['demo.js', 'demo.html', 'demo.css']) {
        const filePath = path.join(jsfiddleDir, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (/\[(START|END)/.test(content)) {
                console.error(`Region tags leaked into ${filePath}`);
                process.exit(1);
            }
        }
    }

    const detailsContent = [
        `name: ${sampleName}`,
        'authors:',
        '  - Geo Developer IX Documentation Team',
        'tags:',
        '  - google maps',
        'load_type: h',
        'description: Sample code supporting Google Maps Platform JavaScript API documentation.',
        '',
    ].join('\n');
    fs.writeFileSync(path.join(jsfiddleDir, 'demo.details'), detailsContent);
}

const runDocs =
    modeArgs.length === 0 ||
    modeArgs.includes('--docs') ||
    modeArgs.includes('docs');
const runJsFiddle =
    modeArgs.length === 0 ||
    modeArgs.includes('--jsfiddle') ||
    modeArgs.includes('jsfiddle');

if (runDocs) {
    generateDocs();
}
if (runJsFiddle) {
    await generateJsFiddle();
}
