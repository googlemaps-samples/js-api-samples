/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_places_placeid_finder]
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

async function initMap(): Promise<void> {
    // Request needed libraries.
    const [{ InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
        google.maps.importLibrary(
            'marker'
        ) as Promise<google.maps.MarkerLibrary>,
        google.maps.importLibrary(
            'places'
        ) as Promise<google.maps.PlacesLibrary>,
    ]);

    const mapElement = document.querySelector(
        'gmp-map'
    ) as google.maps.MapElement;
    const map = mapElement.innerMap as google.maps.Map;

    const placeAutocomplete = document.querySelector(
        'gmp-place-autocomplete'
    ) as google.maps.places.PlaceAutocompleteElement;

    // Set the map options.
    map.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    // Use the bounds_changed event to bias results to the current map bounds.
    map.addListener('bounds_changed', () => {
        const bounds = map.getBounds();
        if (bounds) {
            placeAutocomplete.locationBias = bounds;
        }
    });

    const infowindow = new InfoWindow();
    const infowindowContent = document.getElementById(
        'infowindow-content'
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    const marker = new AdvancedMarkerElement({
        map: map,
        collisionBehavior:
            google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
    });

    marker.addListener('click', () => {
        infowindow.open(map, marker);
    });

    placeAutocomplete.addEventListener(
        'gmp-select',
        async ({ placePrediction }: any) => {
            infowindow.close();

            const place = placePrediction.toPlace();

            await place.fetchFields({
                fields: ['displayName', 'formattedAddress', 'location', 'id'],
            });

            if (!place.location) {
                return;
            }

            if (place.viewport) {
                map.fitBounds(place.viewport);
            } else {
                map.setCenter(place.location);
                map.setZoom(17);
            }

            // Set the position of the marker using the place ID and location.
            marker.position = place.location;
            // marker.setVisible(true); // AdvancedMarkerElement is visible by default when map and position are set.

            (
                infowindowContent.children.namedItem(
                    'place-name'
                ) as HTMLElement
            ).textContent = place.displayName as string;
            (
                infowindowContent.children.namedItem('place-id') as HTMLElement
            ).textContent = place.id as string;
            (
                infowindowContent.children.namedItem(
                    'place-address'
                ) as HTMLElement
            ).textContent = place.formattedAddress as string;
            infowindow.open(map, marker);
        }
    );
}

initMap();
// [END maps_places_placeid_finder]
