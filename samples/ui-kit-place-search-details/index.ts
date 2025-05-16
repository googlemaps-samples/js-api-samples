/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_details] */

const map = document.querySelector("gmp-map") as HTMLDivElement & { innerMap: google.maps.Map };
const placeList = document.querySelector("gmp-place-list") as HTMLElement & {
    places: google.maps.places.Place[];
    configureFromSearchByTextRequest: (request: google.maps.places.TextSearchRequest) => Promise<void>;
};
const queryInput = document.querySelector(".query-input") as HTMLInputElement;
const searchButton = document.querySelector(".search-button") as HTMLButtonElement;
const placeDetails = document.querySelector("gmp-place-details") as HTMLElement & {
    configureFromPlace: (place: google.maps.places.Place) => void;
};

// Explicitly type the markers object to store AdvancedMarkerElement instances keyed by string (place ID)
let markers: { [key: string]: google.maps.marker.AdvancedMarkerElement } = {};
let infowindow: google.maps.InfoWindow;

async function init(): Promise<void> {
    // Import libraries and assert their types for better type checking
    await google.maps.importLibrary("places") as google.maps.places.PlacesLibrary;
    const { InfoWindow } = await google.maps.importLibrary("maps") as google.maps.maps.MapsLibrary;

    infowindow = new InfoWindow();

    findCurrentLocation();

    // The 'innerMap' property on 'gmp-map' is custom, so we assert it exists
    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });

    searchButton.addEventListener("click", () => {
        // Clear existing markers from the map
        for (const markerId in markers) {
            markers[markerId].map = null;
        }
        markers = {}; // Reset the markers object

        if (queryInput.value) {
            placeList.style.display = 'block';
            placeList.configureFromSearchByTextRequest({
                textQuery: queryInput.value,
                locationBias: map.innerMap.getBounds() as google.maps.LatLngBounds // Asserting type for getBounds()
            }).then(addMarkers);
        }
    });

    // Type the 'place' object in the event listener
    placeList.addEventListener("gmp-placeselect", ({ place }: { place: google.maps.places.Place }) => {
        // Ensure the marker exists before trying to click it
        if (markers[place.id]) {
            markers[place.id].click();
        }
    });
}

async function addMarkers(): Promise<void> {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.marker.MarkerLibrary;
    const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.core.CoreLibrary;
    const bounds = new LatLngBounds();

    if (placeList.places.length > 0) {
        placeList.places.forEach((place: google.maps.places.Place) => { // Explicitly type 'place' in forEach
            const marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location as google.maps.LatLng // Assert position as LatLng
            });
            marker.metadata = { id: place.id };
            markers[place.id] = marker;
            bounds.extend(place.location as google.maps.LatLng); // Assert location as LatLng

            marker.addListener('click', () => { // No need for 'event' parameter if not used
                if (infowindow.isOpen) {
                    infowindow.close();
                }
                placeDetails.style.display = 'block';
                placeDetails.configureFromPlace(place);
                placeDetails.style.width = "350px";
                infowindow.setOptions({
                    content: placeDetails
                });
                infowindow.open({
                    anchor: marker,
                    map: map.innerMap
                });

                // Type the 'event' parameter for gmp-load if it's custom
                placeDetails.addEventListener('gmp-load', () => {
                    // Assert place.viewport as LatLngBounds for fitBounds
                    map.innerMap.fitBounds(place.viewport as google.maps.LatLngBounds, {
                        top: placeDetails.offsetHeight || 206,
                        left: 200
                    });
                });
            });
            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}

async function findCurrentLocation(): Promise<void> {
    const { LatLng } = await google.maps.importLibrary("core") as google.maps.core.CoreLibrary;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = new LatLng(position.coords.latitude, position.coords.longitude);
                map.innerMap.panTo(pos);
                map.innerMap.setZoom(16);
            },
            () => {
                console.log('The Geolocation service failed.');
                map.innerMap.setZoom(16);
            },
        );
    } else {
        console.log("Your browser doesn't support geolocation");
        map.innerMap.setZoom(16);
    }
}

init();
/* [END maps_ui_kit_place_search_details] */
