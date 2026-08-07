---
name: refactor-3d
description: Refactor a Maps 3D sample to be TypeScript-centric.
---

# Maps 3D Sample Refactoring Skill

Objective: Refactor a Maps 3D code sample to be TypeScript-first. When the 3D maps feature was first launched, samples were created with a focus on JavaScript. The TS files may contain `//@ts-nocheck` or `// @ts-ignore` to suppress type errors. The goal is to refactor these samples to use TypeScript correctly. This repository expects sample changes to conform to centralized Prettier and ESLint rules. CI now runs both `prettier --check` over `./samples/` and `eslint`, so generated or edited code should preserve the repo’s normalized formatting, quote style, indentation, semicolon usage, and lint expectations. In addition to formatting, contributors should avoid unnecessary TypeScript suppressions/casts and prefer cleaner typed patterns that satisfy the configured ESLint/TypeScript rules.

## Create a new branch

Create a new Git branch. Name it "refactor-[sample_name]" (replace with the actual sample name).

## Update the copyright date in license headers

All license headers should show the current year. For example:

```html
<!--
@license
Copyright 2026 Google LLC. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->
```

## Update the sample to use the inline bootstrap loader

All samples should use the inline bootstrap loader.

This is the legacy loader that we don't want to use:

```html
<!-- 
    The `defer` attribute causes the script to execute after the full HTML
    document has been parsed. For non-blocking uses, avoiding race conditions,
    and consistent behavior across browsers, consider loading using Promises. See
    https://developers.google.com/maps/documentation/javascript/load-maps-js-api
    for more information.
    -->
<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly"
    defer
></script>
```

Remove that block and replace it with the following tag, making sure to position it within the <head></head> section after the 
<script type="module" src="./index.js"> tag:

```html
<script>
    // prettier-ignore
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "GOOGLE_MAPS_API_KEY"
    });
</script>
```

* If `v: weekly` is present, remove it (it's the default).

* If "v:" lists anything other than weekly, flag it. We will need to make sure the selected channel is still valid (for example it might say beta but now it's on weekly). Also just to be clear, we no longer use callbacks.

## Replace the div tag with gmp-map-3d

The legacy pattern is to declare a DIV element in the HTML file, then manually inject the map:

```html
<div id="map"></div>
```

```typescript
map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -25.363882, lng: 131.044922 },
    zoom: 9,
    mapId: 'DEMO_MAP_ID',
});
```

The new pattern is to declare the `gmp-map-3d` element, and add map properties such as `center`, `range`, `tilt`, `heading`, `mode`, `gesture-handling` and `map-id` to attributes of the gmp-map-3d element (take the values from the `Map3DElement` object, see the ref page for the full list of properties).

Before the properties are declared in the Map3DELement:

```typescript
// Move the values from this block...
const map = new Map3DElement({
    center: { lat: 34.8405, lng: -111.7909, altitude: 1322.7 },
    range: 13279.5,
    tilt: 67.44,
    heading: 0.01,
    mode: 'SATELLITE',
    gestureHandling: 'COOPERATIVE',
});
```

After:

```html
<!-- into the gmp-map-3d element as attributes -->
<gmp-map-3d
    center="34.8405,-111.7909"
    range="13279.5"
    tilt="67.44"
    heading="0.01"
    mode="satellite"
    gesture-handling="cooperative">
</gmp-map-3d>
```

## Clean up package.json

Update the `scripts` section to use the modern build tools (Vite and the centralized build script). Replace the old scripts with:

```json
  "scripts": {
    "build": "bash ../build-single.sh",
    "test": "tsc && npm run build:vite --workspace=.",
    "start": "tsc && vite build --config ../../vite.config.js --base './' && vite --config ../../vite.config.js",
    "build:vite": "vite build --config ../../vite.config.js --base './'",
    "preview": "vite preview --config ../../vite.config.js"
  }
```

If the `package.json` file contains an empty `dependencies` section, remove it.

Notes:

- Sometimes a sample can be more concise if the property of interest is declared programmatically. For example, if a sample wants to demonstrate `heading` it's okay to show that in TypeScript.
- If `document.body.append(map);` appears, remove it since we prefer to explicitly declare the `gmp-map-3d` element.
- Our current samples are inconsistent; some have a <div id="map"></div>, but it's never used.

## Dynamically Import Maps Classes

Do not instantiate Maps classes (like `Map3DElement`, `AdvancedMarkerElement`, etc.) directly from the global `google.maps.*` namespace. Doing so will cause the `build-single.sh` checks to fail. 

Instead, destructure them from `importLibrary()` dynamically:

Before:
```typescript
await google.maps.importLibrary('maps3d');
const map3DElement = new google.maps.maps3d.Map3DElement();
```

After:
```typescript
const { Map3DElement } = await google.maps.importLibrary('maps3d');
const map3DElement = new Map3DElement();
```

## Rename initMap() to init()

This step is VERY IMPORTANT:
Rename all instances of `initMap()` to `init()`.

## Get the gmp-map-3d element

Where we once declared a map element, we now use `document.querySelector` to get the `gmp-map-3d` element:

```typescript
const map3DElement = document.querySelector('gmp-map-3d')!;
```

IMPORTANT:
- Use a null operator (!) instead of casting (`as google.maps.maps3d.Map3DElement`).
- Unlike non-3d maps, there is no `innerMap` property to access.

## Resources

Here's the reference page for 3d-map:

https://developers.google.com/maps/documentation/javascript/reference/3d-map