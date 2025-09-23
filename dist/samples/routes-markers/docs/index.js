"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_markers]
let mapPolylines = [];
const mapElement = document.querySelector('gmp-map');
let innerMap;
// Initialize and add the map.
async function initMap() {
    //  Request the needed libraries.
    await google.maps.importLibrary('maps');
    innerMap = await mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });
    // Call the function after the map is loaded.
    google.maps.event.addListenerOnce(innerMap, 'idle', () => {
        getDirections();
    });
}
async function getDirections() {
    //@ts-ignore
    // Request the needed libraries.
    const [{ Route }, { PinElement }] = await Promise.all([
        google.maps.importLibrary('routes'),
        google.maps.importLibrary('marker'),
    ]);
    // [START maps_routes_markers_request_full]
    // [START maps_routes_markers_request]
    // Define routes request with an intermediate stop.
    const request = {
        origin: 'Parking lot, Christmas Tree Point Rd, San Francisco, CA 94131',
        destination: '100 Spinnaker Dr, Sausalito, CA 94965', // We're having a yummy lunch!
        intermediates: [{ location: '300 Finley Rd San Francisco, CA 94129' }], // But first, we golf!
        travelMode: 'DRIVING',
        fields: ['path', 'legs', 'viewport'],
    };
    // [END maps_routes_markers_request]
    // Call computeRoutes to get the directions.
    const result = await Route.computeRoutes(request);
    if (!result.routes || result.routes.length === 0) {
        console.warn("No routes found");
        return;
    }
    // [END maps_routes_markers_request_full]
    // [START maps_routes_markers_style_maker]
    // Alter style based on marker index.
    function markerOptionsMaker(defaultOptions, 
    //@ts-ignore
    waypointMarkerDetails) {
        const { index, totalMarkers, leg } = waypointMarkerDetails;
        // Style the origin waypoint.
        if (index === 0) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyph: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'green',
                    borderColor: 'green',
                }).element
            };
        }
        // Style all intermediate waypoints.
        if (!(index === 0 || index === totalMarkers - 1)) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyph: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'blue',
                    borderColor: 'blue',
                }).element
            };
        }
        // Style the destination waypoint.
        if (index === totalMarkers - 1) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyph: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'red',
                    borderColor: 'red',
                }).element
            };
        }
        return { ...defaultOptions, map: innerMap };
    }
    const markers = await result.routes[0].createWaypointAdvancedMarkers(markerOptionsMaker);
    // [END maps_routes_markers_style_maker]
    // Fit the map to the route.
    innerMap.fitBounds(result.routes[0].viewport);
    innerMap.setHeading(270);
    // Create polylines and add them to the map.
    mapPolylines = result.routes[0].createPolylines();
    mapPolylines.forEach((polyline) => polyline.setMap(innerMap));
}
initMap();
// [END maps_routes_markers]
