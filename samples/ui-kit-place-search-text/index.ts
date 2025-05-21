/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_text] */
/* [START maps_ui_kit_place_search_text_query_selectors] */
const map = document.querySelector("gmp-map") as any;
const placeList = document.querySelector("gmp-place-list") as any;
const placeDetails = document.querySelector("gmp-place-details") as any;
let marker = document.querySelector('gmp-advanced-marker') as any;
const textSearchInput = document.getElementById('textSearchInput') as any;
const textSearchButton = document.getElementById('textSearchButton') as HTMLButtonElement;

/* [END maps_ui_kit_place_search_text_query_selectors] */
/* [START maps_ui_kit_place_search_text_init_map] */
let markers = {};
let infoWindow;
let center = { lat: 37.395641, lng: -122.077627 };
let bounds;

async function initMap(): Promise<void>  {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

    // Set bounds for location restriction.
    bounds = new google.maps.LatLngBounds(
        { lat: 37.37808200917261, lng: -122.13741583377849 },
        { lat: 37.416676154341324, lng: -122.02261728794109 }
    );

    infoWindow = new google.maps.InfoWindow;

    // Center the map
    let adjustedCenter = offsetLatLngRight(center, -0.005);
    map.innerMap.panTo(adjustedCenter);
    map.innerMap.setZoom(14);

    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });

    textSearchButton.addEventListener('click', searchByTextRequest);
    textSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchByTextRequest();
        }
    });
}
/* [END maps_ui_kit_place_search_text_init_map] */

/* [START maps_ui_kit_place_search_text_query] */
async function searchByTextRequest() {
    if (textSearchInput.value !== "") {
        placeList.style.display = "block";
        placeList.configureFromSearchByTextRequest({
            locationRestriction: bounds,
            textQuery: textSearchInput.value,
        }).then(addMarkers);
        // Handle user selection in Place Details.
        placeList.addEventListener("gmp-placeselect", ({ place }) => {
            markers[place.id].click();
        });
    }
}
/* [END maps_ui_kit_place_search_text_query] */

/* [START maps_ui_kit_place_search_text_add_markers] */
async function addMarkers(){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;

    const bounds = new LatLngBounds();

    if(placeList.places.length > 0){
        placeList.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location,
            });

            markers[place.id] = marker;
            bounds.extend(place.location);
            marker.collisionBehavior = google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;

            marker.addListener('gmp-click',(event) => {
                if(infoWindow.isOpen){
                    infoWindow.close();
                }
                placeDetails.configureFromPlace(place);
                placeDetails.style.display = "block";
                placeDetails.style.width = "350px";
                infoWindow.setOptions({
                    content: placeDetails
                });
                infoWindow.open({
                    anchor: marker,
                    map: map.innerMap
                });
                placeDetails.addEventListener('gmp-load',() => {
                    map.innerMap.fitBounds(place.viewport, { top: 400, left: 400 });
                });

            });
            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}
/* [END maps_ui_kit_place_search_text_add_markers] */

// Helper function to offset the map center.
function offsetLatLngRight(latLng, longitudeOffset) {
    const newLng = latLng.lng + longitudeOffset;
    return new google.maps.LatLng(latLng.lat, newLng);
}

initMap();
/* [END maps_ui_kit_place_search_text] */