---
trigger: glob
description: Enforce strict Google Maps modern API constraints, namespace rules, event cleanup, and functional UI patterns.
globs: "*.ts, *.js"
---

# JavaScript Environment & Scope Conventions

When migrating samples, especially those from varied environments like React, Next.js, or testing frameworks, you may encounter specific patterns for accessing the global scope or configuration.

## Universal Global Access (`globalThis`)

Legacy samples or environment-aware samples often use `globalThis` to access configuration that might be injected at runtime.

### The `globalThis` Pattern

```typescript
const API_KEY = globalThis.GOOGLE_MAPS_API_KEY ?? "YOUR_API_KEY";
```

### Why it's used
- **Universal Compatibility**: `globalThis` works across browsers (`window`), Node.js (`global`), and Web Workers (`self`).
- **Runtime Injection**: It allows test runners, CI/CD pipelines, or build tools (like Vite or Webpack) to inject an API key without modifying the source code.
- **Fallback**: The `??` (nullish coalescing) operator provides a safe fallback to a default string if the global variable is not defined.

## Web Component Lifecycle

When working with Maps JS Web Components, understanding the upgrade process is key.

### `customElements.whenDefined`

This API is used to wait for a custom element's definition to be registered and the element to be "upgraded" by the browser.

```typescript
customElements.whenDefined('gmp-advanced-marker').then(() => {
    // Safely attach listeners or access custom properties
});
```

- **When to use**: Mandatory for elements hardcoded in the HTML file, as they are parsed before the Maps JS API loads and registers the custom element definitions.
- **When NOT to use**: Usually unnecessary for elements created dynamically via `document.createElement()` or the `AdvancedMarkerElement` constructor *after* `importLibrary("marker")` has resolved, as the element is upgraded immediately.

## Event Prefixes

Modern Maps JS components use the `gmp-` prefix for custom events to avoid collisions with standard browser events and provide a clear namespace.

- **Legacy**: `marker.addListener('click', ...)`
- **Modern (Web Components)**: `marker.addEventListener('gmp-click', ...)`
- **Modern (TS Class)**: `marker.addEventListener('gmp-click', ...)` (Advanced Markers use standard DOM events).

## Robust GeoJSON Handling

When parsing or accepting GeoJSON input (which is common in mapping utilities), avoid assuming the input will strictly be a direct `Geometry` object (like `LineString` or `Polygon`). Users frequently copy and paste full GeoJSON `Feature` objects (or `FeatureCollection`s). 

Code handling GeoJSON should gracefully detect the object type and extract coordinates appropriately:

```typescript
if (obj.type === 'Feature') {
    // Extract from Feature wrapper
    const geometry = obj.geometry;
    if (geometry?.type === 'LineString') {
        // ...
    }
} else if (obj.type === 'LineString') {
    // Extract from direct Geometry
    // ...
}
}
```

## Event Cleanup (Memory Leak Prevention)

When destroying or removing Google Maps objects (such as `AdvancedMarkerElement`, `Polyline`, `Polygon`, etc.) that have active listeners attached via `.addListener()`, you must explicitly unbind those listeners. If you only remove the object from the map (e.g., `marker.map = null`), the Google Maps event registry will retain a reference to the listener, preventing the object from being garbage collected and causing a memory leak.

```typescript
// BEFORE removing the marker:
google.maps.event.clearInstanceListeners(marker);
marker.map = null;
```

## Scoping Maps Classes (Avoid Top-Level Reassignment)

When dynamically importing Maps classes (e.g., via `await google.maps.importLibrary(...)`), avoid caching them into top-level `let` variables to share them with helper functions.

**Avoid:**
```typescript
let LatLngClass: typeof google.maps.LatLng;

async function init() {
    const { LatLng } = await google.maps.importLibrary('core');
    LatLngClass = LatLng;
}

function helper() {
    new LatLngClass(0, 0); // Relies on global reassignment
}
```

**Instead:** Move your helper functions *inside* the `init()` block (or a similar closure). This allows them to natively closure over the imported classes and map instances, keeping the global scope clean and avoiding messy reassignment patterns.

```typescript
async function init() {
    const { LatLng } = await google.maps.importLibrary('core');
    
}
```

## Self-Contained Helper Functions (Dynamic Imports)

When extracting logic into helper functions, avoid passing Maps classes as arguments. The `importLibrary` function is memoized, meaning subsequent calls return instantly from cache. You should call it directly within your helper functions to keep them self-contained.

**Avoid:**
```typescript
function makeLegend(PinElementClass: typeof google.maps.marker.PinElement) {
    const pin = new PinElementClass({ ... });
}

async function init() {
    const { PinElement } = await google.maps.importLibrary('marker');
    makeLegend(PinElement);
}
```

**Instead:**
```typescript
async function makeLegend() {
    const { PinElement } = await google.maps.importLibrary('marker');
    const pin = new PinElement({ ... });
}

async function init() {
    // No need to pass the class
    void makeLegend(); 
}
```

## Eliminating Configuration Duplication

When refactoring or migrating samples, proactively check for duplicated configuration objects, arrays, or SVG strings across different functions. Ensure that shared configurations are hoisted to the file's global scope rather than being duplicated inside `init()` and helper functions.

**Avoid:**
```typescript
async function init() {
    const config = { color: 'red' };
    // ...
}

async function makeLegend() {
    const config = { color: 'red' }; // Duplicated
    // ...
}
```

**Instead:**
```typescript
const config = { color: 'red' };

async function init() {
    // Uses global config
}

async function makeLegend() {
    // Uses global config
}
```

## Trust the MVCArray Types (Polyline/Polygon Paths)

When working with Google Maps `Polyline` or `Polygon` paths, avoid creating custom fallback wrappers (e.g. `getLat()`, `getLng()`) or interfaces to abstract `LatLng` vs `LatLngLiteral` types.

When you call `path.getArray()` on an `MVCArray`, the API guarantees that every element returned is a native `google.maps.LatLng` object, regardless of whether a `LatLngLiteral` or `LatLngAltitude` was originally pushed.

**Avoid:**
```typescript
function getLat(p: { lat: number | Function }) {
    return typeof p.lat === 'function' ? p.lat() : p.lat;
}
```

**Instead:** Directly invoke the native methods, knowing the output type is guaranteed:
```typescript
const arr = polyline.getPath().getArray();

arr.forEach(ll => {
    // We safely assume `ll` is a LatLng object
    const lat = ll.lat();
    const lng = ll.lng();
});
```

## Functional Path Updates

When replacing the entire path of a `Polyline` or `Polygon` based on an external array or state (e.g. an array of markers), prefer using functional array methods (`.map().filter()`) and `.setPath()` rather than imperative mutations (`.clear()` followed by `.push()`).

**Avoid:**
```typescript
function rebuildPathFromMarkers() {
    const path = polyline.getPath();
    path.clear();
    markers.forEach((m) => {
        if (m.position) {
            path.push(m.position as google.maps.LatLng);
        }
    });
}
```

**Instead:** Extract the valid positions using functional chaining and replace the path in a single operation:
```typescript
function rebuildPathFromMarkers() {
    const newPath = markers
        .map((m) => m.position)
        // Type predicate ensures the compiler treats remaining elements as valid positions
        .filter((pos): pos is google.maps.LatLngLiteral | google.maps.LatLng => pos != null);
        
    polyline.setPath(newPath);
}
```

## Concurrent Library Imports

When a sample requires multiple Google Maps libraries (e.g., `maps`, `marker`, `places`), always group the `importLibrary` calls within a single `Promise.all()`. This allows the browser to fetch and initialize them concurrently, rather than sequentially blocking on each promise.

**Avoid:**
```typescript
const { Map } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
```

**Instead:**
```typescript
const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("maps"),
    google.maps.importLibrary("marker")
]);
```

## Async API Error Handling in Listeners

When calling asynchronous Maps API methods (like `place.fetchFields()`, `DirectionsService.route()`, etc.) inside event listeners, always wrap the `await` call in a `try...catch` block. This ensures that network or API errors are handled gracefully and provided as user feedback (e.g. via an alert), preventing silent unhandled promise rejections that leave the UI in a broken state.

```typescript
try {
    await place.fetchFields({
        fields: ['location', 'viewport', 'displayName'],
    });
} catch (e: unknown) {
    alert(`Failed to fetch place details: ${String(e)}`);
    return;
}
```

## DOM Clearing (Avoid innerHTML = '')

When clearing all child nodes from a DOM element, avoid using `element.innerHTML = ''`. This invokes the browser's HTML parser unnecessarily and can be a security/performance anti-pattern. 

**Avoid:**
```typescript
const list = document.getElementById('locations-list');
list.innerHTML = ''; // Parses HTML
```

**Instead:** Use the modern, safer, and faster `replaceChildren()` API to empty the element:
```typescript
const list = document.getElementById('locations-list');
list.replaceChildren(); // Safely removes all child nodes
```

## Safe Text Rendering (textContent vs innerHTML)

When setting simple text content, always use `textContent` instead of `innerHTML` to prevent Cross-Site Scripting (XSS) vulnerabilities. However, remember that `textContent` does not parse HTML entities (e.g. `&times;`, `&amp;`). You must use literal characters or Unicode escapes.

**Avoid:**
```typescript
const btn = document.createElement('button');
btn.innerHTML = '&times;'; // Parses HTML, potential XSS vector if input is dynamic
// OR
btn.textContent = '&times;'; // Will literally render "&times;" on screen
```

**Instead:**
```typescript
const btn = document.createElement('button');
btn.textContent = '×'; // Use literal character (or \u00D7)
```

## Namespace Restrictions (google.maps.*)

To enforce the modern Promise-based architecture, the repository's build scripts actively prohibit accessing the global `google.maps` namespace for anything other than `google.maps.importLibrary()`. Using the global namespace directly will cause the CI pipeline to fail with the error: *"Using google.maps namespace for something other than google.maps.importLibrary()."*

**Avoid:**
```typescript
google.maps.event.clearInstanceListeners(marker);
```

**Instead:** Import the required module (e.g. `core` for `event`) and destructure the methods:
```typescript
const [{ event }] = await Promise.all([
    google.maps.importLibrary('core')
]);
// ...
event.clearInstanceListeners(marker);
```

## Initialization Function Name (`init()`)

To ensure consistent alignment with the repository's build scripts (`build-single.sh`), the main initialization function must be named exactly `init()`. Avoid variations like `initMap()`, `initialize()`, or `start()`. Additionally, always call the function as `void init();` to explicitly ignore the returned promise and satisfy `@typescript-eslint/no-floating-promises`.

**Avoid:**
```typescript
async function initMap(): Promise<void> { ... }
initMap();
// OR
async function init(): Promise<void> { ... }
init(); // Floating promise
```

**Instead:**
```typescript
async function init(): Promise<void> { ... }
void init();
```