# Google Maps JavaScript Sample

## 3d-camera-position

An interactive playground designed to help developers understand and experiment with camera positioning in Google Maps 3D.

## Features
- **Live Camera Controls**: Real-time sliders for adjusting `heading`, `tilt`, `range`, and `fov` properties.
- **Coordinate Mapping**: Direct controls to set the camera's focal point via `Latitude`, `Longitude`, and `Altitude`.
- **Code Generator**: Dynamically generates the resulting `<gmp-map-3d>` HTML tag with mapped properties for easy copying and pasting.
- **Continuous Event Syncing**: Listens to map interaction events (like dragging and panning) to keep UI readouts strictly synchronized with live map state.

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

`cd samples/3d-camera-position`
`npm start`

### Build an individual example

`cd samples/3d-camera-position`
`npm run build`

From 'samples':

`npm run build --workspace=3d-camera-position/`

### Build all of the examples.

From 'samples':

`npm run build-all`

### Run lint to check for problems

`cd samples/3d-camera-position`
`npx eslint index.ts`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).
