"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_get_directions]
// Initialize and add the map.
let map;
let mapPolylines = [];
const center = { lat: 37.447646, lng: -122.113878 }; // Palo Alto, CA
// Initialize and add the map.
async function initMap() {
    //  Request the needed libraries.
    const [{ Map }, { Place }, { Route }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places'),
        //@ts-ignore
        google.maps.importLibrary('routes')
    ]);
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: center,
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });
    // [START maps_routes_get_directions_request_string]
    // Use address strings in a directions request.
    const requestWithAddressStrings = {
        origin: '1600 Amphitheatre Parkway, Mountain View, CA',
        destination: '345 Spear Street, San Francisco, CA',
        fields: ['path'],
    };
    // [END maps_routes_get_directions_request_string]
    // [START maps_routes_get_directions_request_placeid]
    // Use Place IDs in a directions request.
    const originPlaceInstance = new Place({
        id: 'ChIJiQHsW0m3j4ARm69rRkrUF3w', // Mountain View, CA
    });
    const destinationPlaceInstance = new Place({
        id: 'ChIJIQBpAG2ahYAR_6128GcTUEo', // San Francisco, CA
    });
    const requestWithPlaceIds = {
        origin: originPlaceInstance,
        destination: destinationPlaceInstance,
        fields: ['path'], // Request fields needed to draw polylines.
    };
    // [END maps_routes_get_directions_request_placeid]
    // [START maps_routes_get_directions_request_latlng]
    // Use lat/lng in a directions request.
    // Mountain View, CA
    const originLatLng = { lat: 37.422000, lng: -122.084058 };
    // San Francisco, CA
    const destinationLatLng = { lat: 37.774929, lng: -122.419415 };
    // Define a computeRoutes request.
    const requestWithLatLngs = {
        origin: originLatLng,
        destination: destinationLatLng,
        fields: ['path'],
    };
    // [END maps_routes_get_directions_request_latlng]
    // [START maps_routes_get_directions_request_pluscode]
    // Use Plus Codes in a directions request.
    const requestWithPlusCodes = {
        origin: '849VCWC8+R9', // Mountain View, CA
        destination: 'CRHJ+C3 Stanford, CA 94305, USA', // Stanford, CA
        fields: ['path'],
    };
    // [END maps_routes_get_directions_request_pluscode]
    // [START maps_routes_get_directions_request_simple]
    // Define a routes request.
    const request = {
        origin: 'Mountain View, CA',
        destination: 'San Francisco, CA',
        travelMode: 'DRIVING',
        fields: ['path'], // Request fields needed to draw polylines.
    };
    // [END maps_routes_get_directions_request_simple]
    // Call computeRoutes to get the directions.
    //@ts-ignore
    // [START maps_routes_get_directions_compute]
    const { routes, fallbackInfo, geocodingResults } = await Route.computeRoutes(request);
    // [END maps_routes_get_directions_compute]
    // Display the raw JSON for the result in the console.
    console.log(`Response:\n ${JSON.stringify(routes, null, 2)}`);
    // [START maps_routes_get_directions_polyline]
    // Use createPolylines to create polylines for the route.
    mapPolylines = routes[0].createPolylines();
    // Add polylines to the map.
    mapPolylines.forEach((polyline) => polyline.setMap(map));
    // Create markers to start and end points.
    const markers = await routes[0].createWaypointAdvancedMarkers();
    // Add markers to the map
    markers.forEach((marker) => marker.setMap(map));
    // [END maps_routes_get_directions_polyline]
    fitMapToPath(routes[0].path);
}
// Helper function to fit the map to the path.
async function fitMapToPath(path) {
    const { LatLngBounds } = await google.maps.importLibrary('core');
    const bounds = new LatLngBounds();
    path.forEach((point) => {
        bounds.extend(point);
    });
    map.fitBounds(bounds);
}
initMap();
// [END maps_routes_get_directions]
