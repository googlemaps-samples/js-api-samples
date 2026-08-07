# Case Studies: Event Handling Samples

This document consolidates case studies for migrating event-driven Google Maps JavaScript API samples.

## 1. Map Event Properties
Demonstrates how to retrieve properties (like zoom level) from event handlers.

### Migration Highlights:
- **Map Element Access**: Uses `document.querySelector('gmp-map').innerMap` to attach listeners.
- **Event Listeners**: Updated to use `innerMap.addListener`.

---

## 2. Feature-Specific Events (Rectangle)
Demonstrates listening to events on specific feature objects like Rectangles.

### Migration Highlights:
- **Feature Interaction**: Feature objects (like `Rectangle`) and `InfoWindow` still use `.setMap()` and `.open()`, but must be passed the `innerMap` instance of the `<gmp-map>` component.
- **Asynchronous Initialization**: Uses `async init` and `importLibrary` for clean modernization.

---

## 3. Web Component Specific Events (`gmp-click`)
Demonstrates event handling specifically for new web component elements.

### Migration Highlights:
- **Native Events**: Replaced `addListener('click', ...)` with standard `addEventListener('gmp-click', ...)` for web components like `<gmp-advanced-marker>`.
- **Handling Element Upgrade**: Uses `customElements.whenDefined` to safely attach listeners to elements defined in HTML that are upgraded asynchronously.
- **TypeScript Casting**: Elements selected via DOM queries are cast to specific types (e.g., `google.maps.marker.AdvancedMarkerElement`) to maintain type safety.
