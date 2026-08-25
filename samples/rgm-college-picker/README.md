# Google Maps JavaScript Sample

## rgm-college-picker

This sample demonstrates using React with the vis.gl wrapper to create a college
picker that shows place details and allows you to get directions to the selected
college.

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

`cd samples/rgm-college-picker` `npm start`

### Build an individual example

`cd samples/rgm-college-picker` `npm run build`

From 'samples':

`npm run build --workspace=rgm-college-picker/`

### Build all of the examples.

From 'samples':

`npm run build-all`

### Run lint to check for problems

`cd samples/rgm-college-picker` `npx eslint app.tsx`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).

## Integration notes

When integrating Google Maps Web Components (Extended Component Library) and
`vis.gl/react-google-maps` within a React application, you may encounter
friction between React's declarative state model and native browser APIs. This
section describes the specific workarounds implemented in this sample to ensure
expected behavior.

### 1. Use slots for web component composition

**The Problem:** React (prior to v19) struggles to pass the standard HTML `slot`
attribute directly to nested Web Components.
**The Fix:** First, we wrapped
slotted elements inside a standard HTML `<div>` (e.g.,
`<div className="SlotDiv" slot="main">`). To avoid breaking the parent Web
Component's internal Flexbox layout, we applied `display: contents;` to the
wrapper `<div>` in `style.css`. This CSS rule makes the `<div>` invisible to the
browser's layout engine, allowing the child component to participate in the
parent's Flexbox layout natively.

### 2. Size the Autocomplete Drop-down

**The Problem:** Ideally the `<PlacePicker>` input field (and its autocomplete
drop-down) should fill the sidebar. However, because of the `display: contents`
wrapper, standard Flexbox rules like `flex-grow: 1` were ignored by the layout
engine, leaving a gap between the edge of the drop-down and the side of the
sidebar.
**The Fix:** Because Web Components default to `display: inline-block`,
we bypassed Flexbox entirely and applied explicit layout constraints directly to
the component host in CSS:

```css
.CollegePicker {
    width: calc(100% - 2rem);
    box-sizing: border-box;
}
```

Because the drop-down's width relies on the input field's physical width,
forcing the component to stretch automatically fixed the drop-down layout
without requiring global CSS overrides on the Maps API's `.pac-container`.

### 3. Retain Map Pan & Zoom (Controlled Camera State)

**The Problem:** Passing the location directly to the map, e.g.
`<Map center={college.location} />` creates a strictly "Controlled Component" in
`@vis.gl/react-google-maps`. Anytime the user tries to pan the map with their
mouse, React immediately snaps the camera back to the locked `college.location`
coordinate, effectively breaking panning and zooming.
**The Fix:** We decoupled
the map's camera from the selected place by doing three things:

1. Created a dedicated `cameraProps` React state to track the map's current
   center and zoom.
2. Added an `onCameraChanged` event listener to the map so it could smoothly
   update its own state while the user dragged it.
3. Created a `useEffect` hook that explicitly intercepts a new college selection
   and programmatically updates the `cameraProps`. This allows the map to fly to
   new searches while remaining fully interactive.

### 4. Fix Broken Reviewer Profile Photos

**The Problem:** Google's secure image servers (`lh3.googleusercontent.com`)
routinely block requests that send unauthorized `Referer` headers (like those
sent from `localhost`). This caused the `<PlaceReviews>` component to render
`alt` text (e.g., "photo of John R") instead of the reviewers' actual profile
avatars. Because the `<img>` tags are inside the component's Shadow DOM, we
couldn't add `referrerpolicy="no-referrer"` to them.
**The Fix:** We applied a
global fix by injecting a meta tag into the `<head>` of `index.html`:

```html
<meta name="referrer" content="no-referrer" />
```

This globally instructs the browser to stop sending the `Referer` header,
allowing the profile avatars to load beautifully while bypassing the Shadow DOM
restriction.

### 5. Fix Implicit Void Returns in React Handlers

**The Problem:** Using arrow function shorthands for event handlers that return
Promises or `void` (e.g., `onClick={() => overlayLayoutRef.current.showOverlay()}`)
causes type errors in TypeScript.
**The Fix:** We explicitly wrapped these handlers in curly braces `{ ... }` and
utilized the `void` operator for fire-and-forget Promises. This prevents accidental
return values from being passed to React's event system.