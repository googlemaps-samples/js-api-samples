# Google Maps JavaScript Sample

## rgm-autocomplete

React Google Maps Library - Place Autocomplete

This sample demonstrates using the Place Autocomplete Element within a React application using the open source vis.gl/react-google-maps library.

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

`cd samples/rgm-autocomplete`
`npm start`

### Build an individual example

`cd samples/rgm-autocomplete`
`npm run build`

From 'samples':

`npm run build --workspace=rgm-autocomplete/`

### Build all of the examples.

From 'samples':

`npm run build-all`

### Run lint to check for problems

`cd samples/rgm-autocomplete`
`npx eslint index.ts`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).

## Integrating Place Autocomplete & The New Place Class

When integrating Google Maps Place Autocomplete within a React application, this sample implements several key best practices and addresses common issues developers encounter with the new Places API.

### 1. Programmatic Instantiation

Instead of rendering the `<gmp-place-autocomplete>` Web Component directly in JSX, this sample programmatically instantiates it using `new placesLibrary.PlaceAutocompleteElement()` and appends it to a React `ref`.

- **Issue:** React's synthetic event system doesn't always seamlessly handle custom Web Component events (like `gmp-select`). Instantiating the element programmatically and attaching standard DOM event listeners ensures events are captured reliably.

### 2. Location Restriction & Cross-Context Objects

When placing the autocomplete Web Component outside the main DOM tree of the map, it may lose automatic context of the map's viewport. To guarantee that search predictions are strictly biased or restricted to the map's current bounds, this sample manually syncs the map's bounds to the autocomplete's `locationRestriction` property.

- **Issue:** Passing complex Google Maps objects (like `LatLngBounds`) directly across the React boundary can sometimes fail due to cross-context `instanceof` checks. Always use `.toJSON()` (e.g., `map.getBounds().toJSON()`) when assigning bounds to bypass these issues. This ensures users see search predictions relevant to their map view.

### 3. Handling Selections: `toPlace()` and `fetchFields()`

When a user selects an item from the autocomplete dropdown, the component fires a `gmp-select` event containing a `placePrediction`.

- **Issue:** The prediction is _not_ a fully populated Place object. You must convert it using `placePrediction.toPlace()` and then explicitly request the data you need by calling `place.fetchFields({ fields: ['location', 'displayName', 'formattedAddress'] })`.
- If you attempt to access a property on the `Place` object that hasn't been fetched, it will be undefined or throw an error. This is a core design principle of the new Places API to ensure you only request (and pay for) the data you use.

### 4. Event Cleanup

Always remove standard DOM event listeners (e.g., `autocomplete.removeEventListener`) and Maps event listeners (`google.maps.event.removeListener`) in your `useEffect` cleanup function to prevent memory leaks when the React component unmounts.
