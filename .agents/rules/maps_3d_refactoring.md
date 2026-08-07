---
trigger: glob
description: Google Maps API sample standards and rules
globs: *.ts, *.js, *.html, *.css
---
# Maps 3D Sample Refactoring Standards

This document outlines the standards for refactoring Maps 3D samples from JavaScript-heavy implementations to modern, TypeScript-centric patterns.

## Objective
Transition legacy 3D samples (often containing `//@ts-nocheck` or `// @ts-ignore`) to fully typed, modern TypeScript implementations using Web Components.

## Implementation Standards

### 1. Library Loading
Always use `google.maps.importLibrary("maps3d")` to ensure 3D components are available and upgraded. 

**Critical Note:** This is required even for purely declarative HTML implementations. If `importLibrary("maps3d")` is not called, the custom elements (like `<gmp-map-3d>`) will not be upgraded and the map will remain blank.

**HTML:**
```html
<gmp-map-3d
  center="37.422, -122.085, 1500"
  range="13000"
  tilt="45"
  heading="0"
  mode="satellite"
  gesture-handling="cooperative"
  map-id="DEMO_MAP_ID">
</gmp-map-3d>
```

**Attribute Mapping:**
Most properties from the legacy `Map3DElement` constructor map directly to attributes on the `<gmp-map-3d>` tag:
- `center`: `lat, lng, altitude` string.
- `range`, `tilt`, `heading`, `roll`: Number strings.
- `fov`: Number string.
- `mode`: Lowercase string (e.g., `"satellite"`, `"hybrid"`).
- `gestureHandling`: Kebab-case attribute `gesture-handling` (e.g., `"cooperative"`).

**Important Constraints & Recommendations:**
- **FOV (Field of View)**: Valid values range from **5.0 to 80.0**. Values outside this range will be ignored or cause rendering issues. 
    - **Clamping Requirement**: When implementing sliders or inputs for FOV, you **must** clamp the values in your logic (e.g., `Math.min(80, Math.max(5, rawFov))`) to ensure the map remains stable.
- **Coordinate Inputs (Lat/Lng)**: While range sliders are tempting for geographic coordinates, **number inputs (`type="number"`)** are often superior for `latitude` and `longitude`.
    - **Precision**: Geographic coordinates require high precision (often 4+ decimal places). Sliders are difficult to tune for such values.
    - **Interaction Conflict**: Users can often change the coordinates by dragging the map directly. Number inputs provide a clear way to display these changing values while allowing users to enter a precise destination manually.

**TypeScript:**
```typescript
const map3DElement = document.querySelector('gmp-map-3d') as google.maps.Map3DElement;
```

### 3. Camera Positioning: `center` vs `cameraPosition`
Maps 3D provides two ways to define the camera's focus:
- **`center`**: The camera faces a specific latitude, longitude, and altitude coordinate. This is the preferred method for focusing on specific points of interest.
- **`cameraPosition`**: The camera itself is placed at the provided coordinates. This can be more complex to manage if you want the view centered on a specific point.

**Note on `range` and `fov`:**
- **`range`**: Controls the physical distance between the camera and the center point (like a physical zoom).
- **`fov` (Field of View)**: Controls the angle of the camera's lens. High values = wide-angle lens (more periphery); low values = telephoto lens.

#### The Camera Analogy:
- **Range (Walking)**: Adjusting range is like walking physically closer to or further away from your subject. Getting closer (low range) exaggerates depth and makes nearby objects look much larger than background objects.
- **FOV (Zoom Lens)**: Adjusting FOV is like standing in one spot and turning the zoom ring on a camera lens. A low FOV (telephoto) flattens the scene, making distant objects appear similar in size to foreground objects. A high FOV (wide-angle) distorts the edges but captures a much wider view.

- **Roll**: Controls the sideways tilt of the camera lens (clockwise or counter-clockwise rotation).

### 4. API Paradigm Contrast: Center vs. CameraPosition

When building educational tools or playgrounds, it is highly instructive to provide a way to toggle between these two modes at the same geographic coordinates. This demonstrates the "conundrum" of camera focus:

1.  **Center Mode (Looking AT a point)**:
    - Focuses on a specific target.
    - Camera "pivots" around this point.
    - Rotation and tilt are relative to this focal point.
2.  **CameraPosition Mode (Looking FROM a point)**:
    - Places the camera at a precise point in space.
    - Rotation and tilt are absolute from the camera's perspective.
    - This mode is useful for "drone" or "first-person" perspectives but makes centering on a target more difficult.

#### The "Drone" Perspective Shift:
To create a striking visual contrast when switching from **Center** to **CameraPosition** mode at the same coordinates:
1.  **Coordinates**: Keep the target Lat/Lng but add a small `altitude` (e.g., `50m`).
2.  **Orientation**: Set a steep `tilt` (e.g., `80&deg;`) and a specific `heading` (e.g., `90&deg;` to look towards the horizon).
3.  **Effect**: This shifts the view from a "top-down" bird's-eye view looking *at* a point to a "low-altitude drone" view looking *out* from that point across the landscape.

#### The Toggle Pattern:
In samples like `3d-camera-center`, a toggle button can be used to set `cameraPosition` to the exact coordinates previously used as the `center`. This helps developers visualize how the view shifts when the camera itself becomes the point of reference instead of the target.

### 3. Key Architectural Difference: No `innerMap`
Unlike the 2D `<gmp-map>` element, the 3D `<gmp-map-3d>` element **does not have an `innerMap` property**. 
- Properties and methods are accessed directly on the `Map3DElement` instance.
- **Wrong:** `mapElement.innerMap.setCenter(...)`
- **Correct:** `mapElement.center = {lat: ..., lng: ..., altitude: ...}`

### 4. Advanced Markers in 3D (`gmp-marker-3d`)
Maps 3D uses specific 3D marker components.
```html
<gmp-map-3d ...>
  <gmp-marker-3d position="37.422, -122.085"></gmp-marker-3d>
</gmp-map-3d>
```

### 5. TypeScript Hygiene
- **Remove Type Suppressions**: Eliminate legacy `//@ts-nocheck` from the top of files.
- **Typings Status (2026)**: 
    - **Supported Properties**: `center`, `heading`, `tilt`, `range`, `roll`, `mode` are generally available in `google.maps.Map3DElement` typings.
    - **Unsupported Properties**: `fov` and some events like `gmp-fovchange` may still require targeted `// @ts-ignore`.
- **Explicit Casting**: Cast DOM queries to specific types (e.g., `google.maps.Map3DElement`) to leverage type safety where available.
- **Explicit Element Declaration**: Prefer declaring `<gmp-map-3d>` in the HTML rather than creating it via `new Map3DElement()` and using `document.body.append(map)`. This makes the sample structure more visible and follows the Web Component first approach.
- **Clean Imports**: Remove unused legacy imports and ensure all libraries are requested via `importLibrary`.

## Troubleshooting

### Blank Map or Persistent Spinner
If the `<gmp-map-3d>` element appears blank (an empty tag in the DOM) or shows a persistent progress spinner on a black background, it is almost always one of two issues:

1.  **Missing Library Import**: The `maps3d` library was not imported to trigger the custom element upgrade.
    - **Solution**: Ensure `await google.maps.importLibrary("maps3d")` is called in the `index.ts` file.
2.  **Missing Map ID**: Unlike 2D maps which can fall back to a default view, **3D maps require a valid Map ID** to render properly. Without it, the component may fail to initialize, resulting in a black screen and a loading spinner.
    - **Solution**: Ensure the `map-id="DEMO_MAP_ID"` (or your custom ID) attribute is present on the `<gmp-map-3d>` tag.
3.  **Declarative Race Condition**: For complex or animated samples, purely declarative `<gmp-map-3d>` tags may fail to upgrade correctly if the browser parses them before the `maps3d` library is fully loaded, even with an `importLibrary` call.
    - **Solution**: Switch to **programmatic instantiation**. Wait for `await google.maps.importLibrary("maps3d")` to resolve, then create the map using `new Map3DElement({ ... })` and append it to the DOM (e.g., `document.body.append(mapElement)`). This ensures the constructor is available before the element is created.

### InvalidValueError on `cameraPosition`
Setting the `cameraPosition` property on a `Map3DElement` can trigger a `InvalidValueError: <gmp-map-3d>: Cannot set property "cameraPosition" to [object Object]: in property lat: not a number` if the object structure is incorrect.
- **Problem**: Attempting to pass a nested object (e.g., `{ center: { lat, lng, altitude }, ... }`) to the `cameraPosition` property when the API expects a flat coordinates object or a specific `CameraPosition` structure.
- **Solution**: Ensure you are passing the correct object type. In many cases, assigning a coordinates object directly (containing `lat`, `lng`, and `altitude` properties) to `cameraPosition` resolves the conflict.
- **Example**:
  ```typescript
  // Correct
  map3DElement.cameraPosition = { lat: 40.78, lng: -73.96, altitude: 0 };
  ```

### TypeError: Cannot set properties of null (setting 'textContent')
When refactoring a UI panel (e.g., removing label readouts in favor of interactive inputs), it is common to forget to remove the corresponding update logic in the `updateUI` function.
- **Problem**: The script attempts to update an element ID (like `lat-val`) that was removed from the HTML.
- **Solution**: Audit the `updateUI` loop to ensure all targeted DOM elements still exist. Remove or update references to deleted elements to prevent the script from crashing.

## Camera Animations (`flyTo`)

While attributes can be used for static settings, use the `flyTo` method for smooth animations between views.

```typescript
map3DElement.flyTo({
    center: { lat: 35.3606, lng: 138.7274, altitude: 3776 },
    tilt: 75,
    heading: -90,
    range: 5000
});
```

## Camera and Interaction Events

Maps 3D uses standard DOM event listeners for interaction and state changes.

### Key Events for UI Synchronization
- `gmp-animationend`: Fires when a camera animation (like `flyTo`) finishes. Critical for updating UI readouts after the camera settles.
- `gmp-click`: Standard click event for the map and 3D components.
- **Continuous Change Events**: The following events fire whenever the respective property changes, whether through user interaction (dragging/scrolling) or programmatic updates. Use these to keep external UI controls (like sliders or code generators) synchronized with the live map state.
    - `gmp-centerchange`
    - `gmp-headingchange`
    - `gmp-tiltchange`
    - `gmp-rangechange`
    - `gmp-fovchange` (Used to track changes to the lens angle, critical for keeping UI readouts synced during interaction).
    - `gmp-rollchange`
 
 #### Preventing Race Conditions
 When syncing continuous events back to UI controls (like sliders), you must prevent the map from "fighting" the user's active interaction. 
 - **Interaction Flags**: Use an `isUserInteracting` boolean flag. Set to `true` on `'input'` events and `false` on `'change'` events.
 - **Focus Guard**: Check `document.activeElement` before updating a slider value in the synchronization loop.
 
 See the [UI Synchronization Patterns](./ui_synchronization_patterns.md) guide for implementation details.
 
 #### Stateful Parameter Management (Altitude Decoupling)
 In 3D maps, certain properties like `center.altitude` can be reset by the map's terrain collision system during user interaction (e.g., panning). To maintain a custom camera height, you must maintain a local state variable as the source of truth, decoupling it from the map's reported property during synchronization events. 
 
 #### Clamping Parameter Updates
 Continuous events can report values that exceed the logical or UI limits of your controls (e.g., FOV must be between 5.0 and 80.0; Range might exceed the slider max). Always clamp these values during the synchronization loop to prevent visual glitches (like "jittering" slider thumbs).
 
 See the [UI Synchronization Patterns](./ui_synchronization_patterns.md) for implementation details.
 
 ### Implementation
```typescript
map3DElement.addEventListener('gmp-animationend', () => {
    console.log('Camera animation complete');
    updateUIPanel();
});
```

### 6. Manual Flight Animations (Drone Tours) & HUD Design

For advanced scenarios like predetermined flight paths or "drone tours," use `requestAnimationFrame` to perform manual interpolation (LERP) between waypoints. 

#### Premium HUD Design (Glassmorphism)
To maintain a professional, high-fidelity look, use "glassmorphism" for UI overlays that sit on top of 3D imagery.
- **Contrast**: Use deep, semi-transparent backgrounds (e.g., `rgba(10, 15, 25, 0.75)`).
- **Legibility**: Apply `backdrop-filter: blur(12px)` to ensure text remains readable over complex textures.
- **Telemetry**: Use a grid layout for "telemetry" data (altitude, heading, speed). Use **monospace fonts** for values to reinforce the technical/flight-instrument feel.

#### The Waypoint Pattern:
Define a series of points containing camera properties.

```typescript
interface Waypoint {
  lat: number;
  lng: number;
  altitude: number;
  heading: number;
}

const flightPath: Waypoint[] = [
  { lat: 47.6205, lng: -122.3493, altitude: 150, heading: 180 },
  { lat: 47.6097, lng: -122.3422, altitude: 100, heading: 150 },
  // ...
];
```

#### The Interpolation Loop:
Use a linear interpolation (LERP) function within a `requestAnimationFrame` loop to update the `Map3DElement` properties.

```typescript
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function animateFlight(timestamp: number) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = (elapsed % durationPerSegment) / durationPerSegment;
  const currentSegment = Math.floor(elapsed / durationPerSegment) % flightPath.length;

  const currentPoint = flightPath[currentSegment];
  const nextPoint = flightPath[(currentSegment + 1) % flightPath.length];

  // Interpolate camera properties
  mapElement.center = {
    lat: lerp(currentPoint.lat, nextPoint.lat, progress),
    lng: lerp(currentPoint.lng, nextPoint.lng, progress),
    altitude: lerp(currentPoint.altitude, nextPoint.altitude, progress)
  };
  mapElement.heading = lerp(currentPoint.heading, nextPoint.heading, progress);

  // Sync telemetry UI here...
  
  requestAnimationFrame(animateFlight);
}
```

## UI Layout: Positioning Overlays

Unlike the 2D `<gmp-map>`, the current version of `<gmp-map-3d>` **does not support control slots** (e.g., `slot="control-inline-start-block-start"`). Placing elements inside these slots within the `<gmp-map-3d>` tag will cause them to be ignored and remain invisible.

### Standards for 3D Overlays:
1.  **DOM Placement**: Place the UI container **outside** the `<gmp-map-3d>` element in the HTML.
2.  **CSS Positioning**: Use standard CSS positioning (`position: absolute`) to overlay the UI on top of the map.
3.  **Z-Index**: Ensure the overlay has a `z-index` higher than the map to prevent interaction conflicts.

**HTML Example:**
```html
<gmp-map-3d ...></gmp-map-3d>

<div id="ui-container">
  <!-- UI Panel content -->
</div>
```

**CSS Example:**
```css
#ui-container {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}
```

## Best Practices & Tips

### Character Encoding (Degree Symbols)
Avoid using literal degree symbols (`°`) in HTML, as they can be misinterpreted (e.g., appearing as `Â°`) depending on the server's encoding settings.
- **Always use the HTML entity**: `&deg;`
- **Example**: `Heading: 45&deg;`

## Case Study: 3D Camera Boundary
When refactoring samples like `3d-camera-boundary`, ensure that camera-specific properties (like `cameraPosition` or `bounds`) are handled directly on the `Map3DElement` according to the latest 3D API specifications.
