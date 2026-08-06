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

When integrating Google Maps Place Autocomplete within a React application, this sample implements a key best practice for maintaining strict location bias:

### Flawless Bounds Synchronization (Location Restriction)
When placing the modern `<gmp-place-autocomplete>` Web Component inside a floating React Portal or outside the main DOM tree of the map, it may lose automatic context of the map's viewport. 
To guarantee that search predictions are strictly biased or restricted to the map's current bounds, this sample programmatically mounts the `PlaceAutocompleteElement` and manually syncs the map's bounds.
By listening to the map's `bounds_changed` event and assigning `map.getBounds().toJSON()` to the element's `locationRestriction` property, we safely bypass any cross-context issues across the React boundary. This ensures users always see search predictions strictly relevant to their current map view rather than their IP address.
