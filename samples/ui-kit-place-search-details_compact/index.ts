/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_details_compact] */
const mapContainer = document.getElementById("map-container") as HTMLElement;
const placeList = document.querySelector("gmp-place-list") as HTMLElement & {
    places: google.maps.places.Place[];
    configureFromSearchByTextRequest: (request: google.maps.places.TextSearchRequest) => Promise<void>;
};
const queryInput = document.querySelector(".query-input") as HTMLInputElement;
const searchButton = document.querySelector(".search-button") as HTMLButtonElement;
const detailsContainer = document.getElementById("details-container") as HTMLElement; // Added
const placeDetails = document.querySelector("gmp-place-details-compact") as HTMLElement & {
    place: google.maps.places.Place; // Assuming gmp-place-details-compact also has a 'place' property
};
const placeRequest = document.querySelector("gmp-place-details-place-request") as HTMLElement & {
    place: google.maps.places.Place; // Explicitly defining the 'place' property
};

let markers: { [key: string]: google.maps.marker.AdvancedMarkerElement } = {};
let infowindow: google.maps.InfoWindow;
let gMap: google.maps.Map;

async function init(): Promise<void> {
    // We don't need to explicitly get PlaceDetailsCompactElement or PlaceDetailsPlaceRequestElement
    // from importLibrary unless we were creating new instances of them programmatically.
    // We are selecting existing elements from the DOM.
    await google.maps.importLibrary("places") as google.maps.places.PlacesLibrary;
    const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.maps.MapsLibrary;

    let mapOptions: google.maps.MapOptions = {
        center: { lat: -37.813, lng: 144.963 },
        zoom: 2,
        mapTypeControl: false,
        clickableIcons: false,
        mapId: '5b858b2528b9f784'
    };

    gMap = new Map(mapContainer, mapOptions);
    infowindow = new InfoWindow();

    findCurrentLocation();

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
                locationBias: gMap.getBounds() as google.maps.LatLngBounds // Asserting type for getBounds()
            }).then(addMarkers);
        }
    });

    placeList.addEventListener("gmp-placeselect", ({ place }: { place: google.maps.places.Place }) => {
        if (markers[place.id]) { // Ensure marker exists before clicking
            markers[place.id].click();
        }
    });
}

async function addMarkers(): Promise<void> {
    console.log(placeList); // Log placeList for debugging
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.marker.MarkerLibrary;
    const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.core.CoreLibrary;
    const bounds = new LatLngBounds();

    if (placeList.places.length > 0) {
        placeList.places.forEach((place: google.maps.places.Place) => {
            const marker = new AdvancedMarkerElement({
                map: gMap,
                position: place.location as google.maps.LatLng // Assert position as LatLng
            });
            marker.metadata = { id: place.id };
            markers[place.id] = marker;
            bounds.extend(place.location as google.maps.LatLng); // Assert location as LatLng

            marker.addListener('click', () => {
                if (infowindow.isOpen) {
                    infowindow.close();
                }
                placeDetails.style.display = 'block';
                placeRequest.place = place; // Assign the Place object to the placeRequest component
                placeDetails.style.width = "350px"; // Ensure consistent width
                infowindow.setOptions({
                    content: placeDetails
                });
                infowindow.open({
                    anchor: marker,
                    map: gMap
                });

                placeDetails.addEventListener('gmp-load', () => {
                    // It's generally better to use place.viewport if available for fitting bounds,
                    // otherwise fitBounds on the bounds object for all markers.
                    // The original code used fixed values (500, 400) which might not be dynamic.
                    // If place.viewport isn't exactly what you need, reconsider the strategy.
                    gMap.fitBounds(place.viewport as google.maps.LatLngBounds, {
                        top: 500, // These fixed values should be tested carefully
                        left: 400
                    });
                }, { once: true }); // Use { once: true } to prevent multiple listeners on subsequent clicks
            });
            gMap.setCenter(bounds.getCenter());
            gMap.fitBounds(bounds);
        });
    }
}

async function findCurrentLocation(): Promise<void> {
    const { LatLng } = await google.maps.importLibrary("core") as google.maps.core.CoreLibrary;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = new LatLng(position.coords.latitude, position.coords.longitude);
                gMap.panTo(pos);
                gMap.setZoom(16);
            },
            () => {
                console.log('The Geolocation service failed.');
                gMap.setZoom(16);
            },
        );
    } else {
        console.log("Your browser doesn't support geolocation");
        gMap.setZoom(16);
    }
}

init();
/* [END maps_ui_kit_place_search_details_compact] */
