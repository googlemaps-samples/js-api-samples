/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* [START maps_ui_kit_place_search_nearby] */

/* [START maps_ui_kit_place_search_nearby_query_selectors] */
const map = document.querySelector("gmp-map") as any;
const placeList = document.querySelector("gmp-place-list") as any;
const typeSelect = document.querySelector(".type-select") as any;
const placeDetails = document.querySelector("gmp-place-details") as any;
const placeDetailsRequest = document.querySelector('gmp-place-details-place-request') as any;
let marker = document.querySelector('gmp-advanced-marker') as any;
/* [END maps_ui_kit_place_search_nearby_query_selectors] */
let markers = {};
let infoWindow;

async function initMap(): Promise<void>  {
    await google.maps.importLibrary('places');
    const { LatLngBounds } = await google.maps.importLibrary('core') as google.maps.CoreLibrary;
    const { InfoWindow } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
    const { spherical } = await google.maps.importLibrary('geometry') as google.maps.GeometryLibrary;

    infoWindow = new InfoWindow;

    function getContainingCircle(bounds) {
        const diameter = spherical.computeDistanceBetween(
            bounds.getNorthEast(),
            bounds.getSouthWest()
        );
        const calculatedRadius = diameter / 2;
        const cappedRadius = Math.min(calculatedRadius, 50000); // Cap the radius to avoid an error.
        return { center: bounds.getCenter(), radius: cappedRadius };
    }

    findCurrentLocation();

    map.innerMap.setOptions({
        mapTypeControl: false,
        clickableIcons: false,
    });

    /* [START maps_ui_kit_place_search_nearby_event] */
    placeDetails.addEventListener('gmp-load', (event) => {
        console.log('gmp-load event fired on placeDetails! Current place data:', placeDetails.place);

        // Adjust the position by using the viewport.
        const placeViewport = placeDetails.place.viewport;
        const infoWindowPadding = {
            top: 500,   // Padding from the top edge of the map
            bottom: 10, // Padding from the bottom edge of the map
            left: 360, // Padding from the left edge (e.g., info window width + small margin)
            right: 10  // Padding from the right edge
        };
        // Create a new LatLngBounds from the placeViewport
        const newBounds = new LatLngBounds(
            placeViewport.getSouthWest(),
            placeViewport.getNorthEast()
        );

        // Fit the bounds with the calculated padding
        map.innerMap.fitBounds(newBounds, infoWindowPadding);
    });

    typeSelect.addEventListener('change', (event) => {
        // First remove all existing markers.
        for(marker in markers){
            markers[marker].map = null;
        }
        markers = {};

        if (typeSelect.value) {
            placeList.style.display = 'block';
            placeList.configureFromSearchNearbyRequest({
                locationRestriction: getContainingCircle(
                    map.innerMap.getBounds()
                ),
                includedPrimaryTypes: [typeSelect.value],
            }).then(addMarkers);
            // Handle user selection in Place Details.
            placeList.addEventListener('gmp-placeselect', ({ place }) => {
                markers[place.id].click();
            });
        }
    });
    /* [END maps_ui_kit_place_search_nearby_event] */
}

async function addMarkers(){
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;
    const { LatLngBounds } = await google.maps.importLibrary('core') as google.maps.CoreLibrary;

    const bounds = new LatLngBounds();

    if(placeList.places.length > 0){
        placeList.places.forEach((place) => {
            let marker = new AdvancedMarkerElement({
                map: map.innerMap,
                position: place.location
            });

            markers[place.id] = marker;
            bounds.extend(place.location);

            marker.addListener('gmp-click', (event) => {
                if(infoWindow.isOpen){
                    infoWindow.close();
                }

                placeDetailsRequest.place = place.id;
                placeDetails.style.display = 'block';
                placeDetails.style.width = '350px';
                infoWindow.setOptions({
                    content: placeDetails,
                });
                infoWindow.open({
                    anchor: marker,
                    map: map.innerMap
                });
            });

            map.innerMap.setCenter(bounds.getCenter());
            map.innerMap.fitBounds(bounds);
        });
    }
}

async function findCurrentLocation(){
    const { LatLng } = await google.maps.importLibrary('core') as google.maps.CoreLibrary;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = new LatLng(position.coords.latitude,position.coords.longitude);
            map.innerMap.panTo(pos);
            map.innerMap.setZoom(14);
          },
          () => {
            console.log('The Geolocation service failed.');
            map.innerMap.setZoom(14);
          },
        );
      } else {
        console.log('Your browser doesn\'t support geolocation');
        map.innerMap.setZoom(14);
      }

}

initMap();
/* [END maps_ui_kit_place_search_nearby] */