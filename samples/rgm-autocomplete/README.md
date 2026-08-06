# Google Maps JavaScript Sample

## rgm-autocomplete

React Google Maps Library - Place Autocomplete

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

## Best Practices for Place Autocomplete in React

When integrating Google Maps Place Autocomplete within a React application, this sample implements two key best practices:

### 1. Flawless Bounds Synchronization (Location Restriction)
When placing an autocomplete widget inside a floating React Portal or outside the main DOM tree of the map, newer Web Components (like `<gmp-place-autocomplete>`) may lose context of the map's viewport. 
To guarantee that search predictions are strictly biased or restricted to the map's current bounds, this sample uses the rock-solid traditional imperative class: `new placesLibrary.Autocomplete()`. 
By calling `autocomplete.bindTo('bounds', map);`, the autocomplete widget perfectly syncs with the map's internal bounds state, ensuring users always see search predictions relevant to their current map view rather than their IP address.

### 2. Hydrating to the Modern `Place` Class
While the traditional Autocomplete class returns a legacy `PlaceResult`, this sample demonstrates how to seamlessly upgrade it to the modern `google.maps.places.Place` class without paying for duplicate API requests:
* First, configure the Autocomplete widget to *only* request the `place_id` (`fields: ['place_id']`). This is included in the autocomplete session and is extremely fast.
* Second, intercept the `place_changed` event, grab the `place_id`, and use it to instantiate a modern `Place` class (`new placesLibrary.Place({ id })`).
* Finally, call `await place.fetchFields(...)` to hydrate the object with its geometry and details before passing it up to your React state.
