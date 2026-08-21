---
trigger: glob
description: Google Maps API sample standards and rules
globs: *.ts, *.js, *.html, *.css
---
# Troubleshooting Google Maps Samples

## Node.js & npm Issues

### EBADENGINE (Unsupported Engine)
The `EBADENGINE` warning occurs during `npm install` when the current Node.js version does not meet the requirements specified in a package's `engines` field (common with ESLint updates).

**Example Error:**
```text
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'eslint@10.2.0',
npm warn EBADENGINE   required: { node: '^20.19.0 || ^22.13.0 || >=24' },
npm warn EBADENGINE   current: { node: 'v22.12.0', npm: '11.1.0' }
npm warn EBADENGINE }
```

**Resolution:**
1.  **Upgrade Node.js**: Use a version manager (like `nvm` or `fnm`) to switch to a supported version.
    ```bash
    nvm install 22
    nvm use 22
    ```
2.  **Verify Environment**: Ensure your terminal session is using the intended version if multiple versions are installed.
3.  **Ignore Warnings**: If the version mismatch is minor (e.g., v22.12.0 vs v22.13.0), the package will likely still function, and the warning can be ignored for local development.

## Web Component Race Conditions

### Marker or Map not found / Interaction failed
If you hardcode markers in HTML and try to interact with them via script, you may encounter race conditions where the script runs before the element is upgraded.

**Resolution:**
Use `customElements.whenDefined` to guard initialization code.
```typescript
customElements.whenDefined('gmp-advanced-marker').then(() => {
  // Safe to attach listeners or configure properties
});
```

## Maps 3D Specific Issues

### Blank Map (Un-upgraded Element or Missing Map ID)
A common issue in Maps 3D samples is the map appearing blank or with a persistent loading spinner, even if the HTML markup seems correct.

**Causes:**
1.  **Un-upgraded Element**: Using the modern inline bootstrap loader, the Maps JS API does not automatically register the `<gmp-map-3d>` or `<gmp-marker-3d>` custom elements. They must be explicitly requested.
2.  **Missing Map ID**: Unlike 2D maps which may fall back to a default rendering, `<gmp-map-3d>` requires a valid `map-id` (e.g., `map-id="DEMO_MAP_ID"`) to initialize correctly. Without it, the map area may remain black with a progress spinner.
3.  **Declarative Race Condition**: For complex or animated samples, purely declarative `<gmp-map-3d>` tags may fail to upgrade correctly if the browser parses them before the `maps3d` library is fully loaded.

**Resolution:**
1.  Ensure that `google.maps.importLibrary('maps3d')` is called in your TypeScript/JavaScript file.
2.  Verify that the `<gmp-map-3d>` element in your HTML includes a `map-id` attribute.
3.  If the issue persists in complex or animated samples, switch to **programmatic instantiation**. Use `new Map3DElement({ ... })` inside the `init` function after the `importLibrary` call.

```typescript
async function init(): Promise<void> {
    // This upgrades the <gmp-map-3d> element in the HTML
    await google.maps.importLibrary('maps3d');
}
```

```html
<!-- Correct attribute inclusion -->
<gmp-map-3d map-id="DEMO_MAP_ID" ...></gmp-map-3d>
```

### Invisible UI Components
If custom UI panels (like controls or legends) are not appearing on a 3D map, check their placement and slotting.

**Cause:**
`<gmp-map-3d>` does not support the same `slot` attributes (like `control-inline-start-block-start`) as `<gmp-map>`. Elements placed in these non-existent slots inside the `<gmp-map-3d>` tag are not rendered by the browser.

**Resolution:**
1.  Move the UI container **outside** the `<gmp-map-3d>` element in the HTML.
2.  Use CSS `position: absolute` and `z-index` to manually place the UI over the map area.

### InvalidValueError on `cameraPosition`
Setting the `cameraPosition` property on a `Map3DElement` can trigger a `InvalidValueError: <gmp-map-3d>: Cannot set property "cameraPosition" to [object Object]: in property lat: not a number` if the object structure is incorrect.

**Cause:**
This usually happens when attempting to pass a nested object (e.g., `{ center: { lat, lng, altitude }, ... }`) to the `cameraPosition` property when the API expects a flat coordinates object or a specific `CameraPosition` structure.

**Resolution:**
Ensure you are passing the correct object type. In many cases, assigning a flat coordinates object directly (containing `lat`, `lng`, and `altitude` properties) to `cameraPosition` resolves the conflict.

```typescript
// Correct flat structure
map3DElement.cameraPosition = { lat: 40.78, lng: -73.96, altitude: 0 };
```
