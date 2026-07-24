---
trigger: glob
description: Google Maps API sample standards and rules
globs: *.ts, *.js, *.html, *.css
---
# Interactive UI Synchronization Patterns for 3D Maps

This document outlines patterns for maintaining a perfectly synchronized state between a `gmp-map-3d` component and external UI controls (like sliders and text inputs).

## 1. The Synchronization Loop

When building interactive playgrounds or "code generator" tools, a common requirement is to have UI controls reflect the map's state in real-time while also allowing the user to manipulate the map through those controls.

### The "Loop" Architecture:
1.  **Map -> UI**: Listen for continuous change events on the map and update UI controls.
2.  **UI -> Map**: Listen for user interaction events on the controls and update map properties.

### Key Events for 3D Maps:
- `gmp-centerchange`
- `gmp-headingchange`
- `gmp-tiltchange`
- `gmp-rangechange`
- `gmp-fovchange`
- `gmp-rollchange`

## 2. Preventing "Jumping" Controls

A common issue occurs when a user interacts with a slider: the slider moves, the map updates, the map fires a change event, and the UI synchronization logic sets the slider's value again. If the values are even slightly out of sync or if the slider's default position doesn't match the initial map state, the control may "jump" or fight the user's interaction.

### Best Practice: Syncing All Control Types
Ensure that the `updateUI` function (which runs on map change events) updates **all** relevant UI states, not just text readouts.
- **Text Readouts**: Update `.textContent`.
- **Sliders**: Update `.value`. This ensures that if the map was moved via a different gesture (e.g., panning), the sliders "follow" the movement.
- **Number Inputs**: Update `.value`.

```typescript
let isUserInteracting = false;

const updateUI = () => {
    const heading = map3DElement.heading.toFixed(0);
    // ... calculate other values ...

    // Update text labels
    headingVal.textContent = heading;
    
    // GUARD 1: Focus Guard
    // Check document.activeElement before updating a slider value.
    if (document.activeElement !== fovSlider) fovSlider.value = fov;

    // GUARD 2: Interaction Flag (Superior for high-frequency events)
    // Use an interaction flag guard to prevent the map update loop from 
    // fighting the user while they are actively sliding/typing.
    if (!isUserInteracting) {
        headingSlider.value = heading;
        tiltSlider.value = tilt;
        rangeSlider.value = Math.min(10000, parseFloat(range)).toString(); // Clamping
        // @ts-ignore
        const roll = map3DElement.roll.toFixed(0);
        rollSlider.value = roll;
    }
    
    // Update number inputs for coordinates
    if (document.activeElement !== latInput) latInput.value = center.lat.toFixed(4);
    if (document.activeElement !== lngInput) lngInput.value = center.lng.toFixed(4);
};

// Event Listener Pattern with Flags
const handleSliderInput = (e: Event, prop: string) => {
    isUserInteracting = true;
    const val = parseFloat((e.target as HTMLInputElement).value);
    // @ts-ignore
    map3DElement[prop] = val;
    updateUI();
};

const resetInteraction = () => {
    isUserInteracting = false;
};

headingSlider.addEventListener('input', (e) => handleSliderInput(e, 'heading'));
headingSlider.addEventListener('change', resetInteraction);
```

## 4. Stateful Parameter Management (Altitude Override)

In some cases, the map property (like `center.altitude`) might reset or behave unexpectedly during specific gestures (like panning over variable terrain or when the map is configured to lock to ground). This can cause the UI sliders to "snap back" or values to be lost.

### The Problem:
Setting `map3DElement.center = { lat, lng, altitude: 1000 }` places the camera at 1000m. However, a subsequent user pan gesture might trigger a `gmp-centerchange` event where the `altitude` in the new center object is reported as 0 (or the ground elevation), even if the camera is still at the desired height. If the `updateUI` logic reads this value back, the UI will reset to 0.

### The "Stateful Override" Pattern:
Maintain a local state variable in your script for the property you want to "persist". Use this variable as the source of truth for UI readouts and when calculating new property objects for the map.

```typescript
let currentAltitude = 30; // Local source of truth

const updateUI = () => {
    const center = map3DElement.center;
    if (center) {
        const lat = center.lat.toFixed(4);
        const lng = center.lng.toFixed(4);
        
        // Use the local state instead of map3DElement.center.altitude
        const alt = currentAltitude.toFixed(0);

        altitudeVal.textContent = alt;
        // Do NOT sync the altitude slider here if it fights user input
        
        // When generating code, use the persistent state
        codeElem.textContent = `<gmp-map-3d center="${lat},${lng},${alt}" ...></gmp-map-3d>`;
    }
};

altitudeSlider.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    currentAltitude = val; // Update the source of truth
    const currentCenter = map3DElement.center;
    map3DElement.center = { lat: currentCenter.lat, lng: currentCenter.lng, altitude: val };
    updateUI();
});
```

### Why Decoupling is Necessary:
User interactions with the map (like panning) often trigger automatic engine calculations for properties like `altitude` (e.g., snapping to ground terrain). If the UI listens to these engine-calculated values and writes them back to the controls, it can create a "fight" where the user's manual slider setting is immediately overwritten by the map's ground-collision logic. Maintaining a local state variable for the user's desired value ensures the UI remains consistent with the user's intent.

## 5. Clamping Slider Limits

In 3D environments, camera properties (like `range`) can fluctuate wildly depending on perspective (e.g., changing `altitude` can increase `range` past 10km). If a map event fires with a value that exceeds the defined `max` of an HTML slider, the slider thumb may "jitter" or go out of bounds.

### Best Practice:
Always clamp incoming map values to the slider's defined limits in the `updateUI` loop.

```typescript
// Clamp range to the slider's max (e.g., 10000)
rangeSlider.value = Math.min(10000, parseFloat(range)).toString();
```

## 5. Precision Input Synchronization

For geographic coordinates (Latitude/Longitude), standard range sliders lack the precision required for meaningful 3D placement. 

### Implementation Standards:
1.  **Use Number Inputs**: `type="number"` with a small `step` (e.g., `0.0001`).
2.  **Event Selection**:
    -   **`input`**: Updates the map immediately as the user types. Best for "live" feels, but can cause map jitter if the value is invalid during typing (e.g., just a minus sign).
    -   **`change`**: Updates the map only when the user commits the value (Enter or Blur). Best for precision work where map jitter is undesirable.
3.  **Horizontal Layout**: Group Lat/Lng side-by-side using Flexbox to save vertical space and group related data.

## 6. Refactoring and Null References

When refactoring a UI (e.g., replacing label readouts with interactive input boxes), it is easy to leave behind code that tries to update the old, deleted elements.

### The Risk:
If your `updateUI` function attempts to set `.textContent` on an element that has been removed from the HTML, it will throw a `TypeError: Cannot set properties of null`. Because `updateUI` is often triggered by frequent map events, this can crash the entire interaction script, causing all UI synchronization to stop.

### Best Practice:
Always audit your TypeScript variable declarations and the `updateUI` loop after making HTML changes. Ensure that every `document.getElementById` target still exists and that the script is targeting the new interactive elements instead of the old labels.

## 5. Instructive Design: The "API Paradigm Contrast"

A powerful educational pattern for 3D camera controls is a **toggle** between `center` (Looking AT) and `cameraPosition` (Looking FROM).

### Implementation Strategy:
1.  **State Tracking**: Use a boolean (e.g., `isCenterMode`) to track the current perspective.
2.  **Mode Toggle**: Use a dramatic perspective shift to highlight the difference.

```typescript
let isCenterMode = true;
const initialCenter = { lat: 40.78, lng: -73.96, altitude: 0 };

btn.addEventListener('click', () => {
    if (isCenterMode) {
        // Switch to Camera Position Mode (Looking FROM)
        // Place camera 50m up at the target site
        map3DElement.cameraPosition = { ...initialCenter, altitude: 50 };
        map3DElement.tilt = 80;
        map3DElement.heading = 90; // Look towards the horizon
        isCenterMode = false;
    } else {
        // Revert to Center Mode (Looking AT)
        map3DElement.center = initialCenter;
        map3DElement.range = 1500;
        map3DElement.tilt = 70;
        isCenterMode = true;
    }
});
```

This demonstrates the fundamental difference between the two camera models in a visually striking way.
