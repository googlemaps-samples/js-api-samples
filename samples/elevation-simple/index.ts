/**
 * @license
 * Copyright 2026 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_elevation_simple]
async function initMap(): Promise<void> {
    // Request needed libraries.
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('elevation');

    const mapElement = document.querySelector('gmp-map')!;
    const innerMap = mapElement.innerMap;

    const elevator = new google.maps.ElevationService();
    const infowindow = new google.maps.InfoWindow({});

    infowindow.open(innerMap);

    // Add a listener for the click event. Display the elevation for the LatLng of
    // the click inside the infowindow.
    innerMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        displayLocationElevation(event.latLng!, elevator, infowindow);
    });
}

function displayLocationElevation(
    location: google.maps.LatLng,
    elevator: google.maps.ElevationService,
    infowindow: google.maps.InfoWindow
) {
    // Initiate the location request
    elevator
        .getElevationForLocations({
            locations: [location],
        })
        .then(({ results }) => {
            infowindow.setPosition(location);

            // Retrieve the first result
            if (results[0]) {
                // Open the infowindow indicating the elevation at the clicked position.
                infowindow.setContent(
                    'The elevation at this point <br>is ' +
                        results[0].elevation +
                        ' meters.'
                );
            } else {
                infowindow.setContent('No results found');
            }
        })
        .catch((e) =>
            infowindow.setContent('Elevation service failed due to: ' + e)
        );
}

void initMap();
// [END maps_elevation_simple]
