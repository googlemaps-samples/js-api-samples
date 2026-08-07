# Case Studies: 3D Mapping Samples

This document consolidates case studies for refactoring and creating 3D mapping samples using the Google Maps JavaScript API.

## 1. 3D Camera Boundary Refactoring
Demonstrates restricting the 3D camera to a specific bounding box and configuring gesture handling.

### Refactoring Pattern:
- **Declarative Map Setup**: Replaced manual `Map3DElement` instantiation with `<gmp-map-3d>` in HTML.
- **Handling Component Upgrade**: Quereied the element and applied properties (`bounds`, `gestureHandling`) in TypeScript after calling `importLibrary('maps3d')`.
- **CSS for Web Components**: Applied styles directly to the `gmp-map-3d` tag.

### Key Learnings:
- **Direct Property Access**: 3D maps allow setting properties like `bounds` and `gestureHandling` directly on the `Map3DElement` instance rather than through an `innerMap`.
- **Typing Management**: Targeted `@ts-ignore` comments are preferred over full-file `@ts-nocheck` to maintain type safety elsewhere.

---

## 2. 3D Camera Center Refactoring
Demonstrates a pure declarative approach to setting up a 3D map with a marker.

### Refactoring Pattern:
- **Pure Declarative HTML**: All map properties (`center`, `range`, `tilt`, etc.) and the marker (`gmp-marker-3d`) are defined in HTML.
- **Mandatory Library Loading**: The TypeScript file MUST call `importLibrary('maps3d')` even if it doesn't interact with the map, to trigger the custom element upgrade.

### Key Learnings:
- **Component Upgrade**: Always ensure `importLibrary` is called to register web components.
- **Minimalist TypeScript**: For purely declarative samples, TypeScript serves as the "ignition" for the web component lifecycle.
- **Debugging Blank Maps**: A blank map is often a sign that the library wasn't requested, preventing element upgrade.
- **The Toggle Pattern**: In samples like `3d-camera-center`, a toggle button can be used to set `cameraPosition` to the exact coordinates previously used as the `center`. This helps developers visualize how the view shifts when the camera itself becomes the point of reference instead of the target.
    - **Implementation**: Stored the initial center point and linked a button click listener to update the map.
    - **Troubleshooting Assignment Errors**: During implementation, setting `cameraPosition = { center: initialCenter, tilt: 70, ... }` may trigger a `lat: not a number` InvalidValueError. 
    - **Fix**: The 3D element property `cameraPosition` often expects a flat coordinates object (e.g. `map3DElement.cameraPosition = initialCenter`). 
    - **Educational Effect**: This visually demonstrates how "positioning the camera at a point" (CameraPosition) results in a different view than "centering the camera on a point" (Center), even with identical coordinates.

---

## 3. 3D Camera Position (Feature Sample)
A high-quality, interactive 3D camera controller sample demonstrating premium UI design and educational utility.

### Implementation Patterns:
- **Overcoming Slotting Limitations**: `<gmp-map-3d>` does not currently support control slots. UI panels must be positioned as standard absolute overlays in CSS, outside the map element.
- **Glassmorphism UI**: semi-transparent blur effect for a modern aesthetic.
- **Educational Utility: Live Code Generation & Playground**: Acts as a "cheat sheet" for the camera position documentation page. Provides real-time HTML generation based on the camera's current state, allowing developers to "visualize" and then "copy" the exact configuration. Includes parameters like `range` (physical distance) and `fov` (lens angle) to show their distinct effects on the view.
- **Coordinate Precision**: Replaced `range` sliders with **number inputs** for Latitude and Longitude. 
    - **Precision**: Allows users to input exact coordinates and see high-precision readouts (4+ decimal places) as they drag the map.
    - **Control**: Number inputs are superior for geographic coordinates as they avoid the "jitter" and inaccuracy of small sliders when trying to hit a specific spot on the globe.
- **FOV Constraints**: Implemented input clamping for `fov` to ensure it stays within the valid API range of **5.0 to 80.0**.
- **Minimalist Data Visualization**:
    - **Monospace Typography**: Applied monospace fonts to coordinate and parameter inputs. This reinforces the "Developer Tool" aesthetic and makes high-precision geographic data easier to read.
    - **Redundant Panel Removal**: Removed the dedicated "Live Camera Data" status section once coordinate inputs were implemented as numeric boxes. Since the boxes themselves update in real-time as the user drags the map (bi-directional sync), a separate status display became redundant and its removal reduced UI noise.
- **Encoding Stability**: Always use HTML entities (`&deg;`) for degree symbols to ensure consistent rendering across different platform encodings (avoiding artifacts like `Â°`).
- **Total UI Synchronization (The Jump Prevention Pattern)**: 
    - **Problem**: UI sliders and readouts can get out of sync if the user interacts with the map directly (dragging, zooming). If a slider is not updated to match the map's state, the next time the user touches it, the map will "jump" to the slider's stale value.
    - **Solution**: Bind `updateUI` logic to specific camera change events: `gmp-centerchange`, `gmp-headingchange`, `gmp-tiltchange`, `gmp-rangechange`, and `gmp-fovchange`.
    - **Implementation**: Inside `updateUI`, ensure every control (sliders, number inputs, text readouts) has its `value` or `textContent` explicitly set to the map's current property value.
    - **Live Feedback**: Use `gmp-animationend` to update UI components after smooth transitions (like `flyTo`) complete.
    - **Dual-Binding & Focus Guarding**: Coordinate inputs (`lat`/`lng`) must be updated during map-driven events so the text boxes reflect the current focal point while the user is dragging. 
    - **Focus Guarding**: To prevent UI "jitter" or race conditions where the map's automatic event updates fight against the user's manual slider dragging, use a **`document.activeElement`** check. Only update the UI control's value if the user is not currently interacting with it.
- **Stateful Parameter Management (The Altitude Override)**: 
        - **The Conflict**: During manual map panning, the map may report its `center.altitude` as 0 (ground level). If the UI synchronization loop reads this value and sets the altitude slider/box to 0, it will "overwrite" the user's manual altitude setting as soon as they touch the map.
        - **The Solution**: Maintain a local `currentAltitude` state variable in the script. Use this variable as the source of truth for the code generator and the text readout. When the user moves the map, the local altitude is preserved; when the user moves the altitude slider, the local state and the map's property are both updated.
- **Interaction Guards (The Jitter Prevention Pattern)**:
    - **Focus Guarding**: Use `document.activeElement` to prevent the UI synchronization loop from updating a control while the user is typing.
    - **Interaction Flags**: For high-frequency controls like sliders, use a boolean `isUserInteracting` flag. Set it to `true` on `'input'` and `false` on `'change'`. This robustly prevents the map's event loop from "fighting" the user's manual movement, solving "vibrating" or "jittering" sliders.
- **Roll Property**: Inclusion of the `roll` property (sideways camera tilt) to provide all six degrees of freedom in the 3D camera controller.

- **API Paradigm Contrast (The Conundrum)**:
    - **Center (Looking AT)**: The camera pivots around a target location. This is the standard "overhead" or "street view" expectation.
    - **CameraPosition (Looking FROM)**: The camera itself is placed at a precise point in space (e.g., like a drone floating at a specific spot).
    - **Comparison**: Centering the camera at `{lat, lng, altitude: 1000}` looks *at* the ground from 1000m. Setting the `cameraPosition` to those same coordinates puts the camera *on* the ground at that spot, often looking out at the horizon.

---

## 4. 3D Drone Tour (Seattle)
A high-fidelity demonstration of camera positioning and premium HUD design for an immersive "drone" perspective.

### Implementation Patterns:
- **Scaffolding with `new-sample.sh`**: Started with the standard modern boilerplate which includes the inline loader, standard TS/HTML/CSS structure, and package configurations.
- **Premium HUD Overlay**: Implemented a "glassmorphism" telemetry panel (HUD) outside the `<gmp-map-3d>` tag. This panel uses `backdrop-filter: blur(12px)` and a deep navy semi-transparent background to remain legible over complex 3D imagery.
- **Telemetry Display**: Uses a grid layout to display real-time altitude and speed data, reinforcing the "mission control" or "flight simulator" aesthetic.
- **Micro-animations**: Integrated CSS pulse animations for status badges to indicate an active or "live" mission state.
- **Drone View Setup**: Initialized the `<gmp-map-3d>` with a combination of `center` (Lat/Lng), `altitude` (150m), and a steep `tilt` (65&deg;) to simulate a low-altitude drone perspective over downtown Seattle.

### Key Learnings:
- **Visual Impact**: Using modern typography (e.g., 'Outfit' from Google Fonts) and vibrant accent colors (e.g., `#00ffd5`) significantly elevates the quality of the sample from a simple technical demo to a "feature" experience.
- **Structural Integrity**: Placing the UI overlay completely outside the 3D map element is mandatory for visibility, but using `position: absolute` allows it to feel integrated.
- **Educational Value**: Samples that look "fun" (like a flight mission) encourage more deep-dive exploration of the underlying API properties.
