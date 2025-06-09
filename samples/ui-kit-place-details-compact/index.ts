/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_details_compact] */

// Use querySelector to select elements for interaction.
const mapContainer = document.getElementById("map-container") as any;
const detailsContainer = document.getElementById("details-container") as any;
const placeDetails = document.querySelector("gmp-place-details-compact") as any;
const placeDetailsRequest = document.querySelector("gmp-place-details-place-request") as any;
let gMap;
let infowindow;


async function initMap() {
    const {PlaceDetailsCompactElement, PlaceDetailsPlaceRequestElement} = await google.maps.importLibrary("places") as any;
    const {Map, InfoWindow} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;;
    let gMap = new Map(mapContainer, {mapId: 'DEMO_MAP_ID'});
    let marker = new AdvancedMarkerElement({map: gMap});
    let infowindow = new InfoWindow({
            content: placeDetails
        }).open({
            anchor: marker,
            map: gMap
        });

     // Set up map, marker, and infowindow once widget is loaded.
    placeDetails.style.visibility = 'visible';
    placeDetails.addEventListener('gmp-load', (event) => {
        updateMapAndMarker();

    });

    // Function to update map, marker, and infowindow based on place details
    const updateMapAndMarker = () => {
        if (placeDetails.place && placeDetails.place.location) {
            gMap.panTo(placeDetails.place.location);
            gMap.setZoom(16); // Set zoom after panning if needed
            marker.position = placeDetails.place.location;
            marker.collisionBehavior = google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL;
            marker.style.display = 'block';
        //@ts-ignore
            infowindow.setOptions({
                content: placeDetails
            });
        //@ts-ignore
            infowindow.open({
                anchor: marker,
                gMap,
            });
        }
    };

    // Add an event listener to handle clicks.
    gMap.addListener("click", async (event) => {
        marker.position = null;
        event.stop();
        if (event.placeId) {
            placeDetailsRequest.place = event.placeId;
            // Listen for the placeDetails element to be updated
            placeDetails.addEventListener('gmp-load', (event) => {
                updateMapAndMarker();
            });
        } else {
            // Fire when the user clicks the map (not on a POI).
            console.log('No place was selected.');
            marker.style.display = 'none';
        };
    }
);

}

initMap();
/* [END maps_ui_kit_place_details_compact] */
