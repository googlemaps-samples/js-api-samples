"use strict";
/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// [START maps_routes_get_alternatives]
// Initialize and add the map.
let mapPolylines: google.maps.Polyline[] = [];
const mapElement = document.querySelector('gmp-map') as google.maps.MapElement;
let innerMap;

// Initialize and add the map.
async function initMap() {
  //  Request the needed libraries.
  const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

  innerMap = mapElement.innerMap;
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
  const [{ Route, RouteLabel }] = await Promise.all([
    google.maps.importLibrary('routes')
  ]);
  // [START maps_routes_get_alternatives_request_full]
  // [START maps_routes_get_alternatives_request]
  // Build a request.
  const request = {
    origin: 'San Francisco, CA',
    destination: 'Sunset Dr Pacific Grove, CA 93950',
    travelMode: 'DRIVING',
    computeAlternativeRoutes: true,
    fields: ['path', 'routeLabels', 'viewport'], // Request the routeLabels field.
  };
  // [END maps_routes_get_alternatives_request]

  // [START maps_routes_get_alternatives_compute]
  // Call computeRoutes to get the directions.
  const result = await Route.computeRoutes(request);

  if (result.routes) {
    let primaryRoute;
    for (const [index, route] of result.routes.entries()) {
      // Save the primary route for last so it's drawn on top.
      if (
        // Check for the default route.
        route.routeLabels?.includes(
          RouteLabel.DEFAULT_ROUTE,
        )
      ) {
        primaryRoute = route;
      } else {
        await drawRoute(route, false);
      }
    }
    if (primaryRoute) {
      await drawRoute(primaryRoute, true);
      innerMap.fitBounds(primaryRoute.viewport, 100);
    }
  }
  // [END maps_routes_get_alternatives_compute]
  // [END maps_routes_get_alternatives_request_full]

  // Display the raw JSON for the result in the console.
  console.log(`Response:\n ${JSON.stringify(result, null, 2)}`);
}

async function drawRoute(route, isPrimaryRoute) {
  mapPolylines = mapPolylines.concat(
    route.createPolylines({
      polylineOptions: isPrimaryRoute
        ? { map: innerMap }
        : {
            map: innerMap,
            strokeColor: "#669DF6",
            strokeOpacity: 0.5,
            strokeWeight: 8,
          },
      colorScheme: innerMap.get("colorScheme"),
    }),
  );
  // Create markers for start and end points.
  await route.createWaypointAdvancedMarkers({map: innerMap});
}

initMap();
// [END maps_routes_get_alternatives]
