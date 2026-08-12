'use strict';
/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

async function init() {
    const [{ InfoWindow }, { ElevationService }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('elevation'),
    ]);

    const mapElement = document.querySelector('gmp-map');
    const innerMap = mapElement.innerMap;

    const elevator = new ElevationService();
    const infowindow = new InfoWindow();

    infowindow.open(innerMap);

    // Add a listener for the click event. Display the elevation for the LatLng of
    // the click inside the infowindow.
    innerMap.addListener('click', (event) => {
        displayLocationElevation(event.latLng, elevator, infowindow, innerMap);
    });
}

function displayLocationElevation(location, elevator, infowindow, map) {
    // Format numeric values to two decimal places
    const formatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
    });

    // Initiate the location request
    elevator
        .getElevationForLocations({
            locations: [location],
        })
        .then(({ results }) => {
            if (results[0]) {
                const { elevation, location: resultLocation } = results[0];
                infowindow.setPosition(resultLocation);
                infowindow.setContent(
                    `The elevation at ${String(resultLocation)} <br>is ${formatter.format(elevation)} meters.`
                );
            } else {
                infowindow.setPosition(location);
                infowindow.setContent('No results found');
            }

            infowindow.open(map);
        })
        .catch((e) => {
            infowindow.setContent(
                `Elevation service failed due to: ${String(e)}`
            );
        });
}

void init();
