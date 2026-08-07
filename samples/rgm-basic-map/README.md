# Google Maps JavaScript Sample

## rgm-basic-map

React Google Maps Library - Basic Map

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

`cd samples/rgm-basic-map`
`npm start`

### Build an individual example

`cd samples/rgm-basic-map`
`npm run build`

From 'samples':

`npm run build --workspace=rgm-basic-map/`

### Build all of the examples.

From 'samples':

`npm run build-all`

### Run lint to check for problems

`cd samples/rgm-basic-map`
`npx eslint index.ts`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).

## Integrating React with the Google Maps JavaScript API

When integrating Google Maps within a React application, this sample implements several key best practices using the open source `@vis.gl/react-google-maps` library.

### 1. APIProvider

The `<APIProvider>` component is used at the root of the application to load the Google Maps JavaScript API script once. It handles the API loading state and makes the Google Maps instance available to all child components via React Context.

### 2. Map Component

Instead of manually instantiating `new google.maps.Map()` and attaching it to a DOM node, the `<Map>` component allows you to define the map declaratively.

- By using `defaultCenter` and `defaultZoom`, we create an "uncontrolled" map component where the map manages its own state internally, while still initializing it to the correct location.
- The `mapId` property is passed to enable Cloud-based Maps Styling and Advanced Markers.

### 3. Advanced Markers

The legacy `google.maps.Marker` class is deprecated. This sample uses the `<AdvancedMarker>` component to declaratively render the modern `AdvancedMarkerElement` directly on the map.

- **Gotcha:** `AdvancedMarker` requires a valid `mapId` to be provided to the parent `<Map>` component to function correctly.
