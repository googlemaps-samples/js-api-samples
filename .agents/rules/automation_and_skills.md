---
trigger: glob
description: Google Maps API sample standards and rules
globs: *.ts, *.js, *.html, *.css
---
# Automation & AI Agent Skills for Maps Samples

This document describes the specialized skills and automation patterns developed to streamline the migration and refactoring of Google Maps JavaScript API samples.

## 1. The `refactor` Skill

A specialized skill designed to automate the repetitive parts of modernizing a legacy Google Maps sample (DIV-based) to the modern Web Component pattern (`gmp-map`).

### Core Instructions in the Skill:
1.  **Branching**: Create a new branch `refactor-[sample_name]`.
2.  **Copyright Updates**: Advance all license headers to the current year.
3.  **Loader Migration**: Replace legacy `<script src="...">` tags with the **inline bootstrap loader**.
4.  **Component Swap**: 
    - Replace the `<div id="map"></div>` with the `<gmp-map>` element.
    - Map properties from the legacy constructor (center, zoom, mapId) to the element's attributes.
5.  **Logic Update**:
    - Use `document.querySelector('gmp-map')!` with the non-null assertion operator (`!`) to satisfy strict TypeScript rules (avoid casting).
    - Reference the `innerMap` property for 2D maps.
6.  **Dynamic Imports**: Maps classes (like `BicyclingLayer`) must be destructured from `await google.maps.importLibrary()` rather than accessed from the global `google.maps.*` namespace to pass build validation.

### Why this is effective:
- **Consistency**: Ensures all refactored samples follow the exact same architectural pattern.
- **Speed**: Automates the "toil" of boilerplate replacement, allowing the developer to focus on unique sample logic.
- **Correctness**: Encapsulates common pitfalls (like forgetting to update region tags or copyright dates) into a repeatable checklist.

## 2. The `refactor-3d` Skill (Implicit)

While not always a standalone `SKILL.md`, the patterns for refactoring 3D samples are distinct:
- **No `innerMap`**: Properties are set directly on the `Map3DElement`.
- **Absolute Overlays**: UI must be positioned outside the map tag and overlayed via CSS.
- **Mandatory `importLibrary('maps3d')`**: Even for declarative-only samples, the library is required to upgrade the custom element.

## 3. Scaffolding Tools

The repository contains helper scripts to maintain standardization:
- **`./generate-shared-boilerplate.sh [name] [title] [output_dir]`**: A shared foundational script that dynamically generates the exact, normalized `package.json`, `tsconfig.json`, and `README.md` boilerplate. This ensures both migration and new-sample scaffolding adhere to a single source of truth (the DRY pattern).
- **`./new-sample.sh [name]`**: Generates a complete directory structure for a new sample. It stubs out `index.html` (with the inline loader), `index.ts`, and `style.css`, and then invokes the shared boilerplate script.
- **`./migrate-sample.sh [name]`**: Copies existing code from an archive into the new monorepo structure and then invokes the shared boilerplate script.

## 4. Preservation Pattern (`-js` samples)

When refactoring "introductory" content where the legacy programmatic pattern still has pedagogical value, the following automation workflow is used:
1.  **Duplicate**: Copy the original sample to `[name]-js`.
2.  **Rename Region Tags**: Append `_js` to the `[START/END maps_...]` tags.
3.  **Educational Annotation**: Apply the "Educational Comment Pattern" (Option 1) to explain why the JS-first approach is preserved.
4.  **Refactor Original**: Perform the modernization on the main `[name]` sample.

This preserves the "best of both worlds": a modern, web-component-first primary sample, and a secondary "JS-traditional" reference sample for developers who prefer or require the programmatic approach.
