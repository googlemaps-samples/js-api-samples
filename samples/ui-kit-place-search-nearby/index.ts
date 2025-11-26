/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */

/* [START maps_ui_kit_place_search_nearby_query_selectors] */
// Query selectors for various elements in the HTML file.
const map = document.querySelector('gmp-map') as google.maps.MapElement;
const placeSearch = document.querySelector('gmp-place-search') as any;
const placeSearchQuery = document.querySelector(
    'gmp-place-nearby-search-request'
) as any;
const placeDetails = document.querySelector('gmp-place-details-compact') as any;
const placeRequest = document.querySelector(
    'gmp-place-details-place-request'
) as any;
const typeSelect = document.querySelector('.type-select') as HTMLSelectElement;
/* [END maps_ui_kit_place_search_nearby_query_selectors] */

// Global variables for the map, markers, and info window.
const markers: Map<string, google.maps.marker.AdvancedMarkerElement> =
    new Map();
let infoWindow: google.maps.InfoWindow;

// The init function is called when the page loads.
async function init(): Promise<void> {
    // Import the necessary libraries from the Google Maps API.
    const [{ InfoWindow }, { Place }] = await Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
        google.maps.importLibrary(
            'places'
        ) as Promise<google.maps.PlacesLibrary>,
    ]);

    // Create a new info window and set its content to the place details element.
    placeDetails.remove(); // Hide the place details element because it is not needed until the info window opens
    infoWindow = new InfoWindow({
        content: placeDetails,
        ariaLabel: 'Place Details',
    });

    // Set the map options.
    map.innerMap.setOptions({
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
    });

    /* [START maps_ui_kit_place_search_nearby_event] */
    // Add event listeners to the type select and place search elements.
    typeSelect.addEventListener('change', () => searchPlaces());

    placeSearch.addEventListener('gmp-select', (event: Event) => {
        const { place } = event as any;
        markers.get(place.id)?.click();
    });
    placeSearch.addEventListener('gmp-load', () => {
        addMarkers();
    });

    searchPlaces();
}
/* [END maps_ui_kit_place_search_nearby_event] */
// The searchPlaces function is called when the user changes the type select or when the page loads.
async function searchPlaces() {
    // Close the info window and clear the markers.
    infoWindow.close();
    for (const marker of markers.values()) {
        marker.remove();
    }
    markers.clear();

    // Set the place search query and add an event listener to the place search element.
    if (typeSelect.value) {
        const center = map.center!;
        placeSearchQuery.locationRestriction = {
            center,
            radius: 50000, // 50km radius
        };
        placeSearchQuery.locationBias = {
            center,
        };
        placeSearchQuery.includedTypes = [typeSelect.value];
    }
}

// The addMarkers function is called when the place search element loads.
async function addMarkers() {
    // Import the necessary libraries from the Google Maps API.
    const [{ AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        google.maps.importLibrary(
            'marker'
        ) as Promise<google.maps.MarkerLibrary>,
        google.maps.importLibrary('core') as Promise<google.maps.CoreLibrary>,
    ]);
    const bounds = new LatLngBounds();

    if (placeSearch.places.length === 0) {
        return;
    }

    for (const place of placeSearch.places) {
        const marker = new AdvancedMarkerElement({
            map: map.innerMap,
            position: place.location,
            collisionBehavior:
                google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
        });

        markers.set(place.id, marker);
        bounds.extend(place.location);

        marker.addListener('click', () => {
            placeRequest.place = place;
            infoWindow.open(map.innerMap, marker);
        });
    }

    map.innerMap.fitBounds(bounds);
}

init();
/* [END maps_ui_kit_place_search_nearby] */
