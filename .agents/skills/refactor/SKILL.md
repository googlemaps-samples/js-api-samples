---
name: refactor
description: Refactor a Maps sample to use the latest patterns.
---

# Maps Sample Refactoring Skill

Objective: Refactor a Maps to use the latest patterns. The TS files may contain `//@ts-nocheck` or `// @ts-ignore` to suppress type errors. The goal is to refactor these samples to use TypeScript correctly. This repository expects sample changes to conform to centralized Prettier and ESLint rules. CI now runs both `prettier --check` over `./samples/` and `eslint`, so generated or edited code should preserve the repo’s normalized formatting, quote style, indentation, semicolon usage, and lint expectations. In addition to formatting, contributors should avoid unnecessary TypeScript suppressions/casts and prefer cleaner typed patterns that satisfy the configured ESLint/TypeScript rules.

- Code samples are indicated using Markdown triple backticks: ```code```.
- Code and commands are indicated using single backticks: `command`.
- Refer to the formatting-rules skill.

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

## Replace the div tag with gmp-map

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

The new pattern is to declare the `gmp-map` element, and add map properties such as `center` and `map-id` to attributes of the gmp-map element (take the values from the `MapElement` object, see the ref page for the full list of properties).

Before (the properties are declared in the MapElement):

```typescript
// Move the values from this block...
const map = new MapElement({
    center: { lat: 44.5452, lng: -78.5389 },
    zoom: 9,
    mapId: 'DEMO_MAP_ID',
});
```

After:

```html
<gmp-map
    center="44.5452,-78.5389"
    zoom="9"
    map-id="DEMO_MAP_ID">
</gmp-map>
```

Notes:

- Sometimes a sample can be more concise if the property of interest is declared programmatically.
- If `document.body.append(map);` appears, remove it since we prefer to explicitly declare the `gmp-map` element.

## Dynamically Import Maps Classes

Do not instantiate Maps classes (like `BicyclingLayer`, `AdvancedMarkerElement`, etc.) directly from the global `google.maps.*` namespace. Doing so will cause the `build-single.sh` checks to fail. 

Instead, destructure them from `importLibrary()` dynamically:

Before:
```typescript
await google.maps.importLibrary('maps');
const bikeLayer = new google.maps.BicyclingLayer();
```

After:
```typescript
const { BicyclingLayer } = await google.maps.importLibrary('maps');
const bikeLayer = new BicyclingLayer();
```

## Rename initMap() to init()

This step is VERY IMPORTANT:
Rename all instances of `initMap()` to `init()`.

In self-calls it should always be `void init()` to prevent the promise from being returned, which causes the page to wait for the map to load before the page is interactive.

## Get the gmp-map element

Where we once declared a map element, we now use `document.querySelector` to get the `gmp-map` element:

    ```typescript
    const mapElement = document.querySelector('gmp-map')!;
    ```

IMPORTANT:
- Use a non-null assertion operator (`!`) instead of casting (`as google.maps.MapElement`) to satisfy ESLint's strict type rules.

Get the `innerMap` element from `mapElement`:

    ```typescript
    const innerMap = mapElement.innerMap;
    ```

- Use the `innerMap` name to distinguish it from `map` since `innerMap` does NOT yet expose all of
the properties of `map`.

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

## Resources

Here's the reference page for the map class:

https://developers.google.com/maps/documentation/javascript/reference/map