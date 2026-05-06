/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_markers]
let mapPolylines: google.maps.Polyline[] = [];
const mapElement = document.querySelector('gmp-map')!;
let innerMap: google.maps.Map;

// Initialize and add the map.
async function init() {
    //  Request the needed libraries.
    const [{ event }] = await Promise.all([
        google.maps.importLibrary('core'),
        google.maps.importLibrary('maps'),
    ]);

    innerMap = mapElement.innerMap;
    innerMap.setOptions({
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });

    // Call the function after the map is loaded.
    event.addListenerOnce(innerMap, 'idle', () => {
        void getDirections();
    });
}

async function getDirections() {
    // Request the needed libraries.
    const [{ Route }, { PinElement }] = await Promise.all([
        google.maps.importLibrary('routes'),
        google.maps.importLibrary('marker'),
    ]);

    // [START maps_routes_markers_request_full]
    // [START maps_routes_markers_request]
    // Define routes request with an intermediate stop.
    const request: google.maps.routes.ComputeRoutesRequest = {
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
        console.warn('No routes found');
        return;
    }
    // [END maps_routes_markers_request_full]

    // [START maps_routes_markers_style_maker]
    // Alter style based on marker index.
    function markerOptionsMaker(
        defaultOptions: google.maps.marker.AdvancedMarkerElementOptions,
        waypointMarkerDetails: google.maps.routes.WaypointMarkerDetails
    ) {
        const { index, totalMarkers } = waypointMarkerDetails;

        // Style the origin waypoint.
        if (index === 0) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyphText: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'green',
                    borderColor: 'green',
                }),
            };
        }

        // Style all intermediate waypoints.
        if (!(index === 0 || index === totalMarkers - 1)) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyphText: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'blue',
                    borderColor: 'blue',
                }),
            };
        }

        // Style the destination waypoint.
        if (index === totalMarkers - 1) {
            return {
                ...defaultOptions,
                map: innerMap,
                content: new PinElement({
                    glyphText: (index + 1).toString(),
                    glyphColor: 'white',
                    background: 'red',
                    borderColor: 'red',
                }),
            };
        }

        return { ...defaultOptions, map: innerMap };
    }

    await result.routes[0].createWaypointAdvancedMarkers(markerOptionsMaker);
    // [END maps_routes_markers_style_maker]

    // Fit the map to the route.
    innerMap.fitBounds(result.routes[0].viewport!);
    innerMap.setHeading(270);

    // Create polylines and add them to the map.
    mapPolylines = result.routes[0].createPolylines();
    mapPolylines.forEach((polyline) => polyline.setMap(innerMap));
}

void init();
// [END maps_routes_markers]
