# Case Studies: UI Component Samples

This document consolidates case studies for migrating and creating UI components (InfoWindows, Markers, etc.) in Google Maps JavaScript API samples.

## 1. InfoWindow Simple Migration
Demonstrates creating a simple info window that opens when a marker is clicked.

### Migration Highlights:
- **gmp-map Component**: Replaced legacy `div#map` with `<gmp-map>`. Center and zoom moved to HTML attributes.
- **Advanced Markers & gmp-click**: Updated to `google.maps.marker.AdvancedMarkerElement`.
    - **Property**: `gmpClickable: true` enabled for interaction.
    - **Event**: Replaced `addListener("click", ...)` with `addEventListener("gmp-click", ...)`.
- **Safe DOM Content & headerContent**:
    - **Title**: Moved to `headerContent` using `document.createElement("h1")`.
    - **Body**: Built using `document.createElement("div")` and `textContent` to ensure XSS safety.
- **"Double Open" Pattern**:
    - **Auto-Open**: The InfoWindow is opened automatically on load for better UX.
    - **Re-Open**: Click listener retained to allow users to re-open after closing.

### Implementation Pattern:
```typescript
// Create the heading safely
const heading = document.createElement("h1");
heading.textContent = "Uluru (Ayers Rock)";

// Create the content safely
const content = document.createElement("div");
const p1 = document.createElement("p");
p1.textContent = "..."; 
content.appendChild(p1);

// Open on load
infowindow.open({
    anchor: marker,
    map: innerMap,
});

// Re-open on click
marker.addEventListener("gmp-click", () => {
    infowindow.open({
        anchor: marker,
        map: innerMap,
    });
});
```
