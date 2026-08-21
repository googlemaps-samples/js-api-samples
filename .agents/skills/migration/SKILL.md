---
name: sample-migration
description: Migrate a sample from the legacy repo to js-api-samples.
---

# Sample Migration Skill

Objective: Migrate a code sample from the legacy js-samples repository to the new
js-api-samples repository to improve codebase consistency, readability, functionality,
security, and general overall quality.

- Code samples are indicated using Markdown triple backticks: ```code```.
- Code and commands are indicated using single backticks: `command`.

## Create a new branch

Create a new Git branch. Name it "migrate-[sample_name]" (replace with the actual sample name).

## Run migrate-sample.sh

Navigate to the samples/ folder, then use the following command:

./migrate-sample.sh sample-name "Description of the sample."

A new folder with the given name should appear under samples/. It will contain the following files:

index.html
index.ts
package.json
style.css
tsconfig.json

In most cases you can get the description from the existing sample page on DevSite (not all samples have a page).

https://developers.google.com/maps/documentation/javascript/examples/[sample-name]

## Verify region tags for output files

Region tags indicate blocks of code for inclusion in the documentation. The main body of code for TS, HTML, and CSS files should always be enclosed by region tags. The code may contain additional region tags. Check to ensure that HTML, TS, and CSS files contain matching START and END region tags. They are formatted as a comment in their respective language. Region tag names always begin with "maps_". 

In HTML they look like this:

```html
<!-- [START maps_polyline_simple] -->
<!-- [END maps_polyline_simple] -->
```

In TypeScript they look like this:

```typescript
// [START maps_polyline_simple]
// [END maps_polyline_simple]
```

In CSS they look like this:

```css
/* [START maps_polyline_simple] */
/* [END maps_polyline_simple] */
```

Flag any non-matching tags or non-standard formatting you find.

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

When the sample is first migrated, the HTML file will contain the following code:

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

* Replace the "AIza..." API key with `GOOGLE_MAPS_API_KEY` placeholder. This ensures that API key injection will work correctly.

* If `v: weekly` is present, remove it (it's the default).

* If "v:" lists anything other than weekly, flag it. We will need to make sure the selected channel is still valid (for example it might say beta but now it's on weekly). Also just to be clear, we no longer use callbacks.

## Declare the needed libraries

Now that the inline bootstrap is in use, declare libraries. Adjust this step to account for the
unique needs of the sample (scoping may need to be global, destructuring might yield nicer results
in some cases). Use existing samples for guidance if needed.

Here is a simple example (no variable names used):

```typescript
// Request needed libraries.
await google.maps.importLibrary("maps");
```

Here is an example with variables, Promise.all, and destructuring:
```typescript
// Request needed libraries.
const [{ AdvancedMarkerElement, PinElement }] = await Promise.all([
    google.maps.importLibrary('marker'),
    google.maps.importLibrary('maps'),
]);
```

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

The new pattern is to declare the gmp-map element, and add map properties such as `map-id`, `center`, and `zoom` to
attributes of the gmp-map element (take the values from the `map` object).

```html
<gmp-map center="-25.363882,131.044922" zoom="9" map-id="DEMO_MAP_ID"></gmp-map>
```

Where we once declared the map element, we now use document.querySelector to get the `gmp-map` element, then
use that to get the `innerMap` element (innerMap is equivalent to google.maps.Map). Do not cast to a type, instead use the nullish coalescing operator:

```typescript
const mapElement = document.querySelector('gmp-map')!;
const innerMap = mapElement.innerMap;
```

Replace all occurrences of `map` with `innerMap`. Note that `innerMap` does not expose the same set of properties
that `map` does. For properties that are not exposed on `innerMap`, the preferred pattern is to call `setOptions`:

```typescript
innerMap.setOptions({
    mapTypeControl: false
});
```

## Rename initMap() to init()

This step is VERY IMPORTANT:
Rename all instances of `initMap()` to `init()`.

In self-calls it should always be `void init()` to prevent the promise from being returned, which causes the page to wait for the map to load before the page is interactive.

## Remove type augmentation for init()

The legacy samples used some conventions that we no longer use. For example, most of the TypeScript files usually contain a global type augmentation and export which can be safely removed.

```typescript
// [START maps_rectangle_event]
...
  declare global {
  interface Window {
    init: () => void;
  }
}
window.init = init;
// [END maps_rectangle_event]
export {};
```

It's safe to remove the type augmentation and its export. Keep the region tag, and call the initial function (add `void`):

```typescript
// [START maps_rectangle_event]
...
void init();
// [END maps_rectangle_event]
```

## Update to use Advanced Markers

All samples that use markers should be updated to use `AdvancedMarkerElement`. This requires loading the
`marker` library:

  ```typescript
  // Use destructuring if the sample already does so, otherwise omit the variable declarations.
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  ```

Legacy marker code looks like this:

  ```typescript
  const marker = new google.maps.Marker({
    position: uluru,
    map: innerMap,
    title: "Uluru (Ayers Rock)",
  });
  ```

The equivalent code for Advanced Markers looks like this:

  ```typescript
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: uluru, // Position is required for advanced markers.
    map: innerMap,
    title: "Uluru (Ayers Rock)",
  });
  ```

Advanced Markers use `PinElement` to define additional customization (for example scale). This is different
from how legacy markers work, so it's important to note. The next snippet shows using `PinElement`;
Use "append" to add the pin to the marker, and the marker to the map (this is the preferred pattern).

  ```typescript
  // Create a pin element.
  const myPin = new PinElement({
      scale: 1.5,
  });
  // Create a marker.
  const myMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: 37.4239163, lng: -122.0947209 },
  });
  // Append the pin to the marker.
  myMarker.append(myPin);
  // Append the marker to the map.
  mapElement.append(myMarker);
  ```

### Marker clicks and events

Set the `gmpClickable` property to `true` to enable click events on Advanced Markers.

- Legacy markers use `addListener('click', ...)`.
- Advanced markers should use `addEventListener('gmp-click', ...)`

## Clean up the CSS

When the legacy pattern is in use, it's required to specify the height of the map. The gmp-map
element does not require this, so it's safe to remove this block and its comment:

    ```css
    /* 
    * Always set the map height explicitly to define the size of the div element
    * that contains the map. 
    */
    #map {
    height: 100%;
    }
    ```
Since the gmp-map element is already set to `height: 100%` in the default stylesheet there is no need
to explicitly set the height.

Note that setting height on html and body is still required (otherwise the map will be 0px deep).

## Notes

- Note about library imports and destructuring, since this is instructional code we should tend toward being
explicit. Favor using the fully qualified path for things such as `google.maps.marker.AdvancedMarkerElement`,
since sometimes users copy and paste out of context.

## Resources

Here are some helpful links to documentation and other helpful resources:

### Google Maps

https://developers.google.com/maps/documentation/javascript/add-google-map
https://developers.google.com/maps/documentation/javascript/events
https://developers.google.com/maps/documentation/javascript/controls

### Advanced Markers

https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
https://developers.google.com/maps/documentation/javascript/advanced-markers/html-markers
https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions

## Verify the build locally

Before finishing the task, navigate to the newly migrated sample's directory (e.g. `cd samples/my-sample-name`) and run:
`npm run build`

This executes `build-single.sh` which enforces very strict CI validation rules:
- **Whitespace formatting:** The inline bootstrap loader config object must use exactly 16 spaces for `key: "GOOGLE_MAPS_API_KEY"` and 12 spaces for `});`.
- **Parallel loading:** You cannot use empty array destructuring (e.g. `[, { PinElement }]`) for `Promise.all` imports. Reorder your imports to destruct the first element.
- **Namespace restrictions:** You cannot use the `google.maps` namespace in the built `.js` file (except for `importLibrary`). Pass required classes (like `PinElement`) via destructured imports or function arguments instead of calling `google.maps.marker.PinElement`.

If the build fails, read the output carefully and fix the formatting or syntax issues until `npm run build` exits successfully.

## Update to use PlaceAutocompleteElement

Legacy samples often use the `google.maps.places.Autocomplete` widget attached to an HTML `<input>`. This is deprecated.
You must replace it with `google.maps.places.PlaceAutocompleteElement` (which renders as `<gmp-place-autocomplete>`).

1. In the HTML, remove the `<input>` and replace it with a container `<div>` or just append the element to the DOM.
2. In TypeScript, first add global eslint-disables at the top of the file to suppress typescript-eslint errors until `@types/google.maps` is updated:
   ```typescript
   /* eslint-disable @typescript-eslint/no-unsafe-assignment */
   /* eslint-disable @typescript-eslint/no-unsafe-call */
   /* eslint-disable @typescript-eslint/no-unsafe-member-access */
   ```
3. Import `PlaceAutocompleteElement` using `@ts-expect-error`:
   ```typescript
   // @ts-expect-error - when this gets addressed also remove the global eslint-disables above
   const { PlaceAutocompleteElement } = await google.maps.importLibrary('places');
   ```
4. Initialize and attach it:
   ```typescript
   const autocomplete = new PlaceAutocompleteElement();
   document.getElementById('pac-container')!.appendChild(autocomplete);
   ```
5. Listen for the `gmp-select` event (using standard DOM `addEventListener`), call `toPlace()`, and fetch the needed fields:
   ```typescript
   autocomplete.addEventListener(
       'gmp-select',
       async ({
           placePrediction,
       }: google.maps.places.PlacePredictionSelectEvent) => {
           const place = placePrediction.toPlace();
           await place.fetchFields({
               fields: ['location', 'viewport', 'displayName'],
           });
           
           if (place.viewport) {
               map.fitBounds(place.viewport);
           } else if (place.location) {
               map.setCenter(place.location);
           }
       }
   );
   ```

### JS API reference

https://developers.google.com/maps/documentation/javascript/reference