"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_get_directions_panel]
// Initialize and add the map.
let map;
let mapPolylines = [];
let markers = [];
let center = { lat: 37.447646, lng: -122.113878 }; // Palo Alto, CA
// Initialize and add the map.
async function initMap() {
    // Request the needed libraries.
    //@ts-ignore
    const [{ Map }, { Route }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('routes'),
    ]);
    map = new Map(document.getElementById('map'), {
        zoom: 12,
        center,
        mapTypeControl: false,
        mapId: 'DEMO_MAP_ID',
    });
    // Define a simple directions request.
    const request = {
        origin: 'Mountain View, CA',
        destination: 'Sausalito, CA',
        intermediates: ['Half Moon Bay, CA', 'Pacifica Esplanade Beach'],
        travelMode: 'DRIVING',
        fields: ['legs', 'path'],
    };
    // Call computeRoutes to get the directions.
    const { routes } = await Route.computeRoutes(request);
    // Display the raw JSON for the result in the console.
    console.log(`Response:\n ${JSON.stringify(routes, null, 2)}`);
    // Use createPolylines to create polylines for the route.
    mapPolylines = routes[0].createPolylines();
    // Add polylines to the map.
    mapPolylines.forEach((polyline) => polyline.setMap(map));
    fitMapToPath(routes[0].path);
    // Add markers to all the points.
    const markers = await routes[0].createWaypointAdvancedMarkers({ map });
    // [START maps_routes_get_directions_panel_steps]
    // Render navigation instructions
    const directionsPanel = document.getElementById('directions');
    if (!routes || routes.length === 0) {
        if (directionsPanel) {
            directionsPanel.textContent = 'No routes available.';
        }
        return;
    }
    const route = routes[0];
    if (!route.legs || route.legs.length === 0) {
        if (directionsPanel) {
            directionsPanel.textContent = 'The route has no legs.';
        }
        return;
    }
    const fragment = document.createDocumentFragment();
    route.legs.forEach((leg, index) => {
        const legContainer = document.createElement('div');
        legContainer.className = 'directions-leg';
        // Leg Title
        const legTitleElement = document.createElement('h3');
        legTitleElement.textContent = `Leg ${index + 1} of ${route.legs.length}`;
        legContainer.appendChild(legTitleElement);
        if (leg.steps && leg.steps.length > 0) {
            // Add steps to an ordered list
            const stepsList = document.createElement('ol');
            stepsList.className = 'directions-steps';
            leg.steps.forEach((step, stepIndex) => {
                const stepItem = document.createElement('li');
                stepItem.className = 'direction-step';
                const directionWrapper = document.createElement('div');
                directionWrapper.className = 'direction';
                // Maneuver
                if (step.maneuver) {
                    const maneuverNode = document.createElement('p');
                    maneuverNode.textContent = step.maneuver;
                    maneuverNode.className = 'maneuver';
                    directionWrapper.appendChild(maneuverNode);
                }
                // Distance and Duration
                if (step.localizedValues) {
                    const distanceNode = document.createElement('p');
                    distanceNode.textContent = `${step.localizedValues.distance} (${step.localizedValues.staticDuration})`;
                    distanceNode.className = 'distance';
                    directionWrapper.appendChild(distanceNode);
                }
                // Instructions
                if (step.instructions) {
                    const instructionsNode = document.createElement('p');
                    instructionsNode.textContent = step.instructions;
                    instructionsNode.className = 'instruction';
                    directionWrapper.appendChild(instructionsNode);
                }
                stepItem.appendChild(directionWrapper);
                stepsList.appendChild(stepItem);
            });
            legContainer.appendChild(stepsList);
        }
        fragment.appendChild(legContainer);
        directionsPanel?.appendChild(fragment);
    });
}
// [END maps_routes_get_directions_panel_steps]
// Helper function to fit the map to the path.
async function fitMapToPath(path) {
    const { LatLngBounds } = (await google.maps.importLibrary('core'));
    const bounds = new LatLngBounds();
    path.forEach((point) => {
        bounds.extend(point);
    });
    map.fitBounds(bounds);
}
initMap();
// [END maps_routes_get_directions_panel]
