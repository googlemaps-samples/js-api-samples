---
trigger: glob
description: Google Maps API sample standards and rules
globs: *.ts, *.js, *.html, *.css
---
# Google Maps JS Sample Migration Standards

This document outlines the standard procedure and technical requirements for migrating code samples from the legacy `js-samples` repository to the new `js-api-samples` repository.

## Workflow Overview

1.  **Redundancy Check**: Verify the sample does not already exist in the repository under a different name or as part of a combined sample.
2.  **Branch Creation**: 
    - For new migrations from legacy repositories: Create a new branch named `migrate-[sample_name]`.
    - For refactoring existing samples to the latest patterns: Create a new branch named `refactor-[sample_name]`.
3.  **Initial Migration Script**: For new samples, run `./migrate-sample.sh [sample-name] "[Description]"` from the `samples/` directory.
    - This script populates a new folder with `index.html`, `index.ts`, `package.json`, `style.css`, and `tsconfig.json`.
4.  **Boilerplate Generation (New Samples)**: For completely new samples, use `./new-sample.sh [sample-name]` to scaffold the directory and files with the standard modern boilerplate.
5.  **Preservation (Refactoring Only)**: When refactoring introductory or "baseline" content, create an exact copy of the previous version and name it with a `-js` suffix (e.g., `map-simple-js`). This preserves a reference version for documentation or comparative purposes (showing the programmatic constructor approach) while the primary sample is modernized to the Web Component pattern. 
    - **Refactoring with AI Agent Skills**: Use the specialized `refactor` skill to automate the migration of existing samples to the `<gmp-map>` pattern. This ensures consistent attribute mapping, copyright updates, and architectural alignment. See [Automation & AI Agent Skills](./automation_and_skills.md) for details.
    - **Naming**: Avoid using the term "legacy" in these filenames. Use the `-js` suffix.
    - **Region Tags**: Update the START and END region tags (e.g., `[START maps_map_simple]` and `[END maps_map_simple]` -> `[START maps_map_simple_js]` and `[END maps_map_simple_js]`) within the preserved files to ensure they remain unique and correctly identifiable by documentation tools.
6.  **Modernization**: Update the sample to use the latest standards:
    - Use `gmp-map` element instead of legacy `div`.
    - Inline bootstrap loader (see Implementation section).
    - Use the placeholder `GOOGLE_MAPS_API_KEY` for the API key.
    - Update license headers to show the current copyright year (e.g., 2026).
    - Declare libraries using `google.maps.importLibrary`.
    - **Educational Note**: For samples that preserve the JS constructor pattern (e.g., `-js` samples), insert an educational comment block between the copyright header and the first region tag (see [Educational Comment Pattern](#educational-comment-pattern)).
7.  **Security & Code Quality**:
    - Fix XSS issues by replacing with DOM-safe code (e.g., using `document.createElement` and `textContent` for dynamic data).
    - Verify matching START and END region tags in HTML, TS, and CSS files.
    - Ensure the JS API version `v` is set to `weekly`.
    - Clean up TypeScript by removing global type augmentations and explicit exports.
    - Update markers to use `AdvancedMarkerElement`.

## XSS Security Considerations

When migrating samples, pay close attention to code that injects HTML strings into the DOM (e.g., `InfoWindow` content, custom overlays).

### Identifying Risky Patterns
*   **Safe**: Static, hardcoded HTML strings.
    ```typescript
    const content = '<div>Static content</div>';
    ```
*   **Risky**: Concatenating or interpolating dynamic/user-controlled data into HTML strings.
    ```typescript
    const content = '<div>' + userData.name + '</div>'; // DANGEROUS
    ```

### Mitigation Strategies
1.  **Static Content**: Purely hardcoded HTML strings are acceptable for simplicity in basic samples where no external data is involved.
2.  **Dynamic Content**: For any sample handling dynamic, user-controlled, or external data, **DOM APIs** (`document.createElement`, `element.textContent`) or **Sanitization** (e.g., DOMPurify) are **required** to prevent XSS.
3.  **Demonstrating Best Practices**: Authors are encouraged to use the safer DOM API pattern even for static content to promote secure coding habits. See the [XSS Prevention Guide](./security/xss_prevention.md) for detailed implementation patterns.

## Implementation Details

### Inline Bootstrap Loader

Replace the legacy script tag:
```html
<script
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=init&v=weekly"
  defer
></script>
```

With the modern inline loader (positioned after the module script tag in `<head>`):
```html
<script type="module" src="./index.js"></script>
<script>
  // prettier-ignore
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "GOOGLE_MAPS_API_KEY",
  });
</script>
```

**Placement Note**: Position the inline loader after the module script tag in the `<head>`. Use a `// prettier-ignore` comment inside the `<script>` tag to prevent the script content from being wrapped by automated formatting tools.

**Strict CI Validation**: The `build-single.sh` script enforces exact indentation for the loader configuration object to pass static analysis:
- The `key: "GOOGLE_MAPS_API_KEY"` line **must** be indented with exactly 16 spaces.
- The closing `});` line **must** be indented with exactly 12 spaces.

#### Custom Parameters (Region, Language)
When migrating samples that utilize specific `region` or `language` codes, ensure these are preserved in the bootstrap configuration object.

**Legacy URL Pattern:**
`https://maps.googleapis.com/maps/api/js?key=...&region=ES&language=es`

**Modern Inline Configuration:**
```html
<script>
  // prettier-ignore
  (g=>{...})({
    key: "GOOGLE_MAPS_API_KEY",
    region: "ES",
    language: "es",
  });
</script>
```


### Library Declaration
Declare needed libraries at the start of the initialization. 

**Standard Pattern (1-2 libraries):**
```typescript
// Request needed libraries.
await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
```

**Parallel Pattern (3+ libraries):**
When more than two libraries are required, use `Promise.all` for efficient parallel loading.
```typescript
await Promise.all([
  google.maps.importLibrary("maps"),
  google.maps.importLibrary("marker"),
  google.maps.importLibrary("places"),
]);
```

**Strict CI Validation**: Ensure you do not use empty array destructuring (e.g. `const [, { AdvancedMarkerElement }] = ...`) when extracting libraries, as the `build-single.sh` script explicitly bans `[,` in the code. Reorder your `Promise.all` array so that the library you need to destructure comes first.

### Namespace Restrictions

The `build-single.sh` script strictly prohibits direct access to the `google.maps` namespace in built code (except for `google.maps.importLibrary`).
*   **Invalid**: `const pin = new google.maps.marker.PinElement({...})`
*   **Valid**: `const { PinElement } = await google.maps.importLibrary('marker'); const pin = new PinElement({...})`

If you need to access a Google Maps class in a separate function, pass the destructured class as a parameter rather than accessing it via the global namespace.

### Map Modernization (gmp-map)

Legacy Pattern:
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

Modern Pattern:
```html
<gmp-map center="-25.363882,131.044922" zoom="9" map-id="DEMO_MAP_ID"></gmp-map>
```
```typescript
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
const innerMap = mapElement.innerMap;
```

**Naming Convention**: Always use the name `innerMap` to distinguish it from the `map` variable used in legacy code. This is a critical distinction because `innerMap` (the instance of the underlying `Map` class) does NOT yet expose all properties that the legacy `Map` object did. 

**Attribute Usage**: Prefer moving map properties (like `center`, `zoom`, `map-id`) from the constructor object directly into the `gmp-map` element as HTML attributes. 

**Removing `.append()`**: If the legacy code uses `document.body.append(map);`, remove it in favor of the explicit HTML declaration of the `<gmp-map>` element.
```typescript
innerMap.setOptions({
    mapTypeControl: false
});
```

### Advanced Markers Migration

All samples using markers must be updated to use `AdvancedMarkerElement`.

1.  **Import Library**: Ensure the `marker` library is imported.
    ```typescript
    await google.maps.importLibrary("marker");
    ```
2.  **Fully Qualified Paths**: Use fully qualified paths for `AdvancedMarkerElement` and `PinElement` to ensure clarity when code is copied out of context.
    ```typescript
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: uluru,
        map: innerMap,
        title: "Uluru",
        gmpClickable: true, // Must be true for click events
    });
    ```
3.  **Interaction and Events**:
    - Set `gmpClickable: true` in the constructor to enable click events.
    - Use `addEventListener("gmp-click", ...)` instead of the legacy `addListener("click", ...)`.
    ```typescript
    marker.addEventListener("gmp-click", () => {
        // handle click
    });
    ```
4.  **Customization with PinElement**: For customized markers, use `PinElement` and append it to the marker. The preferred pattern is to append the marker to the `mapElement` (the `gmp-map` component).
    ```typescript
    const pin = new google.maps.marker.PinElement({ scale: 1.5 });
    const marker = new google.maps.marker.AdvancedMarkerElement({ position: location });
    marker.append(pin);
    mapElement.append(marker);
    ```

### InfoWindow Modernization

When migrating `InfoWindow` content, follow these modern patterns:

1.  **Use `headerContent`**: Use the `headerContent` property for titles instead of including an `h1` within the `content` property. This avoids common styling issues and white space problems.
2.  **Use DOM APIs**: As outlined in the [XSS Security Considerations](#xss-security-considerations) section, use DOM APIs to build the content element.
3.  **Aria Label**: Always provide an `ariaLabel` for accessibility.

```typescript
const heading = "Location Title";
const content = document.createElement("div");
const body = document.createElement("p");
body.textContent = "This is the location description.";
content.appendChild(body);

const infowindow = new google.maps.InfoWindow({
    headerContent: heading,
    content: content,
    ariaLabel: "Location Title",
});

// "Double Open" Pattern:
// 1. Open automatically on load
infowindow.open({
    anchor: marker,
    map: innerMap,
});

// 2. Retain click behavior so it can be re-opened if closed
marker.addEventListener("gmp-click", () => {
    infowindow.open({
        anchor: marker,
        map: innerMap,
    });
});
```

### TypeScript Cleanup

Legacy samples often included global type augmentations that are no longer necessary:
```typescript
declare global {
  interface Window {
    init: () => void;
  }
}
window.init = init;
export {};
```

Remove these and simply call the initialization function:
    ```typescript
    void init();
    ```

### CSS Cleanup

When `gmp-map` is used, the legacy requirement to specify the height of `#map` is usually removed.

Legacy Requirement:
```css
/* 
 * Always set the map height explicitly to define the size of the div element
 * that contains the map. 
 */
#map {
  height: 100%;
}
```

Modern cleanup: Remove the `#map` height block. Note that setting height on `html` and `body` is still required to ensure the map element expands to fill the container.

### Web Component Patterns

When working with Maps JS Web Components (`<gmp-map>`, `<gmp-advanced-marker>`, etc.), follow these patterns:

1.  **Handling Upgrade Race Conditions**: Use `customElements.whenDefined` to ensure elements are upgraded before attaching event listeners or accessing component properties. See [JavaScript Conventions](./javascript_conventions.md) for more details.
    ```typescript
    customElements.whenDefined('gmp-advanced-marker').then(() => {
        // Element is ready
    });
    ```
2.  **Web Component Events**: Use standard DOM `addEventListener` with `gmp-` prefixed events (e.g., `gmp-click` instead of legacy `click`).
3.  **DOM Selection and Casting**: When querying the DOM for web components, cast the results to the appropriate Google Maps type to ensure type safety and access to component-specific properties.
    ```typescript
    const marker = document.querySelector('gmp-advanced-marker') as google.maps.marker.AdvancedMarkerElement;
    ```
4.  **Implicit Library Loading**: Even when using purely declarative HTML for markers, the `marker` library must still be imported in the script to trigger the element upgrade.
    ```typescript
    await google.maps.importLibrary("marker");
    ```

### Educational Comment Pattern

When maintaining "baseline" samples that use the traditional JavaScript constructor pattern (often named with a `-js` suffix), include a specific comment block to provide context for developers in different stages of adoption.

**Placement**: Between the license header and the first region tag.

**Wording (TS/JS)**:
```javascript
/*
 * Note: This sample demonstrates the standard JavaScript pattern for creating a map. 
 * While this approach remains fully supported and is preferred by some developers, 
 * we recommend considering the declarative <gmp-map> web component for new projects 
 * and modern integrations.
 */
```

**Wording (HTML)**:
```html
<!--
  Note: This sample demonstrates the standard JavaScript pattern for creating a map. 
  While this approach remains fully supported and is preferred by some developers, 
  we recommend considering the declarative <gmp-map> web component for new projects 
  and modern integrations.
-->
```

### Environment & Global Scope

Samples may use patterns like `globalThis` for universal global access, particularly for sourcing API keys dynamically. See the [JavaScript Conventions Guide](./javascript_conventions.md) for more information.

## Modernization & Content Quality

Migration is an opportunity to improve the pedagogical value and modernity of the samples.

### 1. Content Simplification
- **Remove Dated References**: Strip out non-essential historical context (e.g., "last visited June 22, 2009") that makes samples feel obsolete.
- **Clean Text Blocks**: Use template literals (backticks) for large blocks of text to avoid messy string concatenation (`+`).
- **Focus on Clarity**: Refactor complex DOM manipulation or logic to be as readable and simple as possible, following modern standard browser APIs.

### 2. Modern Loader Patterns
Always use the inline bootstrap loader with `v: "weekly"` (unless a specific version is required for a feature).

### 3. Advanced Markers
Transition all samples from `google.maps.Marker` to `google.maps.marker.AdvancedMarkerElement`. Ensure `gmpClickable` is set if interaction is needed, and use the `gmp-click` event.

## Modern Standards Checklist
- [ ] Use `gmp-map` instead of legacy map initialization.
- [ ] Use `importLibrary` for all required API libraries.
- [ ] Ensure `v: "weekly"` is used in the loader.
- [ ] Replace any `innerHTML` or unsafe DOM manipulations with DOM APIs for dynamic content.
- [ ] Update legacy markers to `google.maps.marker.AdvancedMarkerElement`.
- [ ] Verify that region tags (e.g., `[START maps_sample_name]` and `[END maps_sample_name]`) are correctly placed and closed.
- [ ] Remove legacy `Window` interface augmentations and `export {}`.
- [ ] Update license headers to the current year (2026).
- [ ] Remove legacy `#map` height rules in CSS (ensure `html, body` height remains).
- [ ] Run `npm run build` locally in the sample directory to execute `build-single.sh` and verify all strict CI rules are met before committing.

## Resources

### Advanced Markers
- [Migration Guide](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration)
- [Overview](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview)
- [HTML Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/html-markers)
- [AdvancedMarkerElementOptions Reference](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions)

### JS API Reference
- [Maps JavaScript API Reference](https://developers.google.com/maps/documentation/javascript/reference)

## Troubleshooting

### EBADENGINE Warnings
When running `npm install`, you may see warnings like `npm warn EBADENGINE Unsupported engine`. This occurs when your local Node.js version doesn't strictly match the version required by project dependencies (often ESLint packages).

**Solution**: 
1. Upgrade Node.js to the required version (e.g., `nvm install 22 && nvm use 22`).
2. If the mismatch is minor (e.g., v22.12.0 vs v22.13.0), these warnings can typically be ignored as they are not fatal.
